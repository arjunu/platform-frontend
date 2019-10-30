import { isEmpty } from "lodash/fp";
import { delay } from "redux-saga";
import { all, fork, put, select, take } from "redux-saga/effects";

import {
  EEtoNomineeActiveEtoNotifications,
  ENomineeRequestErrorNotifications,
  EtoMessage,
} from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import { NOMINEE_REQUESTS_WATCHER_DELAY } from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import {
  EEtoState,
  TNomineeRequestResponse,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IssuerIdInvalid, NomineeRequestExists } from "../../lib/api/eto/EtoNomineeApi";
import { nonNullable } from "../../utils/nonNullable";
import { actions, TActionFromCreator } from "../actions";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { getEtoContract } from "../eto/sagas";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../eto/types";
import { isOnChain } from "../eto/utils";
import { neuCall, neuTakeLatest, neuTakeUntil } from "../sagasUtils";
import {
  selectActiveEtoPreviewCodeFromQueryString,
  selectCapitalIncrease,
  selectIsISHASignedByIssuer,
  selectNomineeEtoDocumentsStatus,
  selectNomineeEtos,
  selectActiveNomineeEto,
} from "./selectors";
import {
  ENomineeRequestError,
  INomineeRequest,
  TNomineeRequestStorage,
} from "./types";
import { getNomineeTaskStep, nomineeApiDataToNomineeRequests, nomineeRequestResponseToRequestStatus } from "./utils";
import { selectIsBankAccountVerified } from "../bank-transfer-flow/selectors";
import { Dictionary } from "../../types";
import { selectEtoSubStateEtoEtoWithContract } from "../eto/selectors";

export function* loadNomineeTaskData({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {

  try {
    const isVerified:ReturnType<typeof selectIsUserFullyVerified>  = yield select(
      selectIsUserFullyVerified,
    );

    if (isVerified) {
      yield put(actions.nomineeFlow.loadNomineeEtos());
      yield take(actions.nomineeFlow.setActiveNomineeEto);

      const eto:ReturnType<typeof selectActiveNomineeEto> = yield select(
        selectActiveNomineeEto,
      );

      const requiredData: { [key: string]: unknown } = {
        nomineeRequests: put(actions.nomineeFlow.loadNomineeRequests()),
        nomineeRequestsLoaded: take(actions.nomineeFlow.setNomineeRequests),
        bankAccountDetails: put(actions.kyc.loadBankAccountDetails()),
        bankAccountDetailsLoaded: take(actions.kyc.setBankAccountDetails),
      };

      if (eto && isOnChain(eto) && eto.contract.timedState === EETOStateOnChain.Signing) {
        requiredData.isha = put(actions.eto.loadSignedInvestmentAgreement(eto.etoId, eto.previewCode));
        requiredData.ishaLoaded = take(actions.eto.setInvestmentAgreementHash);
        requiredData.etoAgreementsStatus = put(actions.eto.loadEtoAgreementsStatus(eto));
        requiredData.etoAgreementsStatusLoaded = take(actions.eto.setAgreementsStatus);
        requiredData.capitalIncrease = put(actions.eto.loadCapitalIncrease(eto.etoId, eto.previewCode));
        requiredData.capitalIncreaseLoaded = take(actions.eto.setCapitalIncrease);
      }
      yield all(requiredData);
    }
  } catch (e) {
    logger.error("Failed to load Nominee tasks data", e);
    notificationCenter.error(
      createMessage(ENomineeRequestErrorNotifications.FETCH_NOMINEE_DATA_ERROR),
    );
  } finally {
    yield put(actions.nomineeFlow.loadingDone());
  }
}

export function* nomineeDashboardView() {
  yield neuCall(loadNomineeTaskData);

  const selectData = yield all({
    verificationIsComplete: select(selectIsUserFullyVerified),
    nomineeEto: select(selectActiveNomineeEto),
    isBankAccountVerified: select(selectIsBankAccountVerified),
    documentsStatus: select(selectNomineeEtoDocumentsStatus),
    isISHASignedByIssuer: select(selectIsISHASignedByIssuer),
    capitalIncrease: select(selectCapitalIncrease),
  });

  const actualTask = yield getNomineeTaskStep(selectData);

  yield put(
    actions.nomineeFlow.storeNomineeTaskData({
      actualTask
    }),
  );
}

export function* nomineeRequestsWatcher({ logger }: TGlobalDependencies): Iterator<any> {
  while (true) {
    logger.info("Getting nominee task data");
    try {
      yield neuCall(loadNomineeTaskData);
    } catch (e) {
      logger.error("Error getting nominee task data", e);
    }

    yield delay(NOMINEE_REQUESTS_WATCHER_DELAY);
  }
}

export function* loadNomineeRequests({
    apiEtoNomineeService,
    logger,
    notificationCenter
  }: TGlobalDependencies,
) {
  logger.info("loading nominee requests");
  try{
    const nomineeRequests = yield apiEtoNomineeService.getNomineeRequests();
    const nomineeRequestsConverted: TNomineeRequestStorage = yield nomineeApiDataToNomineeRequests(
      nomineeRequests,
    );
    yield put(actions.nomineeFlow.setNomineeRequests(nomineeRequestsConverted))
  } catch (e) {
    notificationCenter.error(createMessage(ENomineeRequestErrorNotifications.FETCH_NOMINEE_DATA_ERROR));

    logger.error("Error while loading nominee requests", e);
  } finally {

  }
}

export function* createNomineeRequest(
  { apiEtoNomineeService, logger, notificationCenter }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.nomineeFlow.createNomineeRequest>,
): Iterator<any> {
  try {
    const nomineeRequest: TNomineeRequestResponse = yield apiEtoNomineeService.createNomineeRequest(
      action.payload.issuerId,
    );
    const nomineeRequestConverted: INomineeRequest = nomineeRequestResponseToRequestStatus(
      nomineeRequest,
    );

    yield put(
      actions.nomineeFlow.storeNomineeRequest(action.payload.issuerId, nomineeRequestConverted),
    );
  } catch (e) {
    if (e instanceof IssuerIdInvalid) {
      logger.error("Failed to create nominee request, issuer id is invalid", e);
      yield put(
        actions.nomineeFlow.storeNomineeRequestError(
          action.payload.issuerId,
          ENomineeRequestError.ISSUER_ID_ERROR,
        ),
      );
      notificationCenter.error(createMessage(ENomineeRequestErrorNotifications.ISSUER_ID_ERROR));
    } else if (e instanceof NomineeRequestExists) {
      logger.error(`Nominee request to issuerId ${action.payload.issuerId} already exists`, e);
      yield put(
        actions.nomineeFlow.storeNomineeRequestError(
          action.payload.issuerId,
          ENomineeRequestError.REQUEST_EXISTS,
        ),
      );
      notificationCenter.error(createMessage(ENomineeRequestErrorNotifications.REQUEST_EXISTS));
    } else {
      logger.error("Failed to create nominee request", e);
      yield put(
        actions.nomineeFlow.storeNomineeRequestError(
          action.payload.issuerId,
          ENomineeRequestError.GENERIC_ERROR,
        ),
      );
      notificationCenter.error(createMessage(ENomineeRequestErrorNotifications.SUBMITTING_ERROR));
    }
  } finally {
    yield put(actions.routing.goToDashboard());
    yield put(actions.nomineeFlow.loadingDone());
  }
}

export function* loadNomineeAgreements(): Iterator<any> {
  const nomineeEto: ReturnType<typeof selectActiveNomineeEto> = yield select(
    selectActiveNomineeEto,
  );

  if (nomineeEto) {
    yield put(actions.eto.loadEtoAgreementsStatus(nomineeEto));
  }
}

export function* loadNomineeSignedInvestmentAgreements(): Iterator<any> {
  const nomineeEto: ReturnType<typeof selectActiveNomineeEto> = yield select(
    selectActiveNomineeEto,
  );

  if (nomineeEto) {
    yield put(actions.eto.loadSignedInvestmentAgreement(nomineeEto.etoId, nomineeEto.previewCode));
  }
}

export function* loadNomineeEto(
  _:TGlobalDependencies,
  eto:TEtoWithCompanyAndContract
){
  if(eto.state === EEtoState.ON_CHAIN){
    eto.contract = yield neuCall(getEtoContract, eto.etoId,eto.state);
  }

  eto.subState = yield select(selectEtoSubStateEtoEtoWithContract,eto);
  return eto
}

export function* loadNomineeEtos({
  apiEtoService,
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterable<any> {
  try {
    const etos: TEtoWithCompanyAndContract[] = yield apiEtoService.loadNomineeEtos();

    const etosByPreviewCode = yield all(
      etos
        .reduce((acc:{[key:string]:unknown},eto) => {
          acc[eto.previewCode] = neuCall(loadNomineeEto,eto);
          return acc
        },{})
    );

    yield put(actions.nomineeFlow.setNomineeEtos({ etos: etosByPreviewCode as Dictionary<TEtoWithCompanyAndContract,string> }));
  } catch (e) {
    logger.error("Nominee ETOs could not be loaded", e);

    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETOS));
  }
}

export function* setActiveNomineeEto({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterable<any> {
  try {
    const etos: ReturnType<typeof selectNomineeEtos> = yield select(selectNomineeEtos);

    if (etos === undefined || isEmpty(etos)) {
      yield put(actions.nomineeFlow.setActiveNomineeEto(undefined));
    } else {
      const forcedActiveEtoPreviewCode: ReturnType<typeof selectActiveEtoPreviewCodeFromQueryString> = yield select(selectActiveEtoPreviewCodeFromQueryString);

      // For testing purpose we can force another ETO to be active (by default it's the first one)
      const shouldForceSpecificEtoToBeActive =
        forcedActiveEtoPreviewCode !== undefined && etos[forcedActiveEtoPreviewCode] !== undefined;

      if (shouldForceSpecificEtoToBeActive) {
        yield put(actions.nomineeFlow.setActiveNomineeEto(forcedActiveEtoPreviewCode));

        notificationCenter.info(
          createMessage(EEtoNomineeActiveEtoNotifications.ACTIVE_ETO_SET_SUCCESS),
        );
      } else {
        const firstEto = nonNullable(Object.values(etos)[0]);
        yield put(actions.nomineeFlow.setActiveNomineeEto(firstEto.previewCode));
      }
    }
  } catch (e) {
    logger.fatal("Could not set active eto", e);

    notificationCenter.error(createMessage(EEtoNomineeActiveEtoNotifications.ACTIVE_ETO_SET_ERROR));
  }
}

export function* nomineeFlowSagas(): Iterator<any> {
  yield fork(neuTakeLatest, actions.nomineeFlow.calculateNomineeTask, nomineeDashboardView);
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeEtos, loadNomineeEtos);
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeRequests, loadNomineeRequests);
  yield fork(neuTakeLatest, actions.nomineeFlow.createNomineeRequest, createNomineeRequest);
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeTaskData, loadNomineeTaskData);
  yield fork(neuTakeLatest, actions.nomineeFlow.setNomineeEtos, setActiveNomineeEto);
  yield fork(
    neuTakeUntil,
    actions.nomineeFlow.startNomineeRequestsWatcher,
    actions.nomineeFlow.stopNomineeRequestsWatcher,
    nomineeRequestsWatcher,
  );
}
