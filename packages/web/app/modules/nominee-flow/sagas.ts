import { compose, isEmpty, keyBy, map, omit } from "lodash/fp";
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
  TCompanyEtoData,
  TEtoDataWithCompany,
  TEtoSpecsData,
  TNomineeRequestResponse,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IssuerIdInvalid, NomineeRequestExists } from "../../lib/api/eto/EtoNomineeApi";
import { nonNullable } from "../../utils/nonNullable";
import { actions, TActionFromCreator } from "../actions";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { loadEtoContract } from "../eto/sagas";
import { EETOStateOnChain } from "../eto/types";
import { isOnChain } from "../eto/utils";
import { loadBankAccountDetails } from "../kyc/sagas";
import { neuCall, neuTakeLatest, neuTakeUntil } from "../sagasUtils";
import {
  selectActiveEtoPreviewCodeFromQueryString,
  selectNomineeEtos,
  selectNomineeEtoWithCompanyAndContract,
} from "./selectors";
import {
  ENomineeLinkBankAccountStatus,
  ENomineeRedeemShareholderCapitalStatus,
  ENomineeRequestError,
  ENomineeUploadIshaStatus,
  INomineeRequest,
  TNomineeRequestStorage,
} from "./types";
import { nomineeApiDataToNomineeRequests, nomineeRequestResponseToRequestStatus } from "./utils";

export function* loadNomineeTaskData({
  apiEtoNomineeService,
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  try {
    const isVerified: ReturnType<typeof selectIsUserFullyVerified> = yield select(
      selectIsUserFullyVerified,
    );

    if (isVerified) {
      // load information that's needed to properly calculate nominee current task
      yield put(actions.nomineeFlow.loadNomineeEtos());

      // wait for active eto to be set
      // even when eto is not yet linked `setActiveNomineeEto` get's dispatched
      yield take(actions.nomineeFlow.setActiveNomineeEto);

      const eto: ReturnType<typeof selectNomineeEtoWithCompanyAndContract> = yield select(
        selectNomineeEtoWithCompanyAndContract,
      );

      if (eto && isOnChain(eto) && eto.contract.timedState === EETOStateOnChain.Signing) {
        yield neuCall(loadNomineeSignedInvestmentAgreements);
      }

      const taskData = yield all({
        nomineeRequests: apiEtoNomineeService.getNomineeRequests(),
        etoAgreementsStatus: neuCall(loadNomineeAgreements),
        bankAccountDetails: neuCall(loadBankAccountDetails),
        // todo query here if data not in the store yet
        // linkBankAccount:
        // acceptTha:
        // redeemShareholderCapital:
        // uploadIsha:
      });

      const nomineeRequestsConverted: TNomineeRequestStorage = nomineeApiDataToNomineeRequests(
        taskData.nomineeRequests,
      );
      // todo convert data
      // const linkBankAccountConverted = ...
      // const acceptThaConverted = ...
      // const redeemShareholderCapitalConverted = ...
      // const uploadIshaConverted = ...

      yield put(
        actions.nomineeFlow.storeNomineeTaskData({
          nomineeRequests: nomineeRequestsConverted,
          linkBankAccount: ENomineeLinkBankAccountStatus.NOT_DONE,
          redeemShareholderCapital: ENomineeRedeemShareholderCapitalStatus.NOT_DONE,
          uploadIsha: ENomineeUploadIshaStatus.NOT_DONE,
        }),
      );
    } else {
      yield put(actions.nomineeFlow.loadingDone());
    }
  } catch (e) {
    logger.error("Failed to load Nominee tasks", e);
    notificationCenter.error(
      createMessage(ENomineeRequestErrorNotifications.FETCH_NOMINEE_DATA_ERROR),
    );
    //show the user what's already loaded
    yield put(actions.nomineeFlow.loadingDone());
  }
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
  const nomineeEto: ReturnType<typeof selectNomineeEtoWithCompanyAndContract> = yield select(
    selectNomineeEtoWithCompanyAndContract,
  );

  if (nomineeEto) {
    yield put(actions.eto.loadEtoAgreementsStatus(nomineeEto));
  }
}

export function* loadNomineeSignedInvestmentAgreements(): Iterator<any> {
  const nomineeEto: ReturnType<typeof selectNomineeEtoWithCompanyAndContract> = yield select(
    selectNomineeEtoWithCompanyAndContract,
  );

  if (nomineeEto) {
    yield put(actions.eto.loadSignedInvestmentAgreement(nomineeEto));
  }
}

export function* loadNomineeEtos({
  apiEtoService,
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterable<any> {
  try {
    const etos: TEtoDataWithCompany[] = yield apiEtoService.loadNomineeEtos();

    yield all(
      etos
        .filter(eto => eto.state === EEtoState.ON_CHAIN)
        .map(eto => neuCall(loadEtoContract, eto)),
    );

    const companies = compose(
      keyBy((eto: TCompanyEtoData) => eto.companyId),
      map((eto: TEtoDataWithCompany) => eto.company),
    )(etos);

    const etosByPreviewCode = compose(
      keyBy((eto: TEtoSpecsData) => eto.previewCode),
      // remove company prop from eto
      // it's saved separately for consistency with other endpoints
      map(omit("company")),
    )(etos);

    yield put(actions.nomineeFlow.setNomineeEtos({ etos: etosByPreviewCode, companies }));
  } catch (e) {
    logger.error("Nominee ETOs could not be loaded", e);

    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETOS));
  }
}

export function* guardActiveEto({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterable<any> {
  try {
    const etos: ReturnType<typeof selectNomineeEtos> = yield select(selectNomineeEtos);

    if (etos === undefined || isEmpty(etos)) {
      yield put(actions.nomineeFlow.setActiveNomineeEto(undefined));
    } else {
      const forcedActiveEtoPreviewCode: ReturnType<
        typeof selectActiveEtoPreviewCodeFromQueryString
      > = yield select(selectActiveEtoPreviewCodeFromQueryString);

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
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeEtos, loadNomineeEtos);
  yield fork(neuTakeLatest, actions.nomineeFlow.createNomineeRequest, createNomineeRequest);
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeTaskData, loadNomineeTaskData);
  yield fork(neuTakeLatest, actions.nomineeFlow.setNomineeEtos, guardActiveEto);
  yield fork(
    neuTakeUntil,
    actions.nomineeFlow.startNomineeRequestsWatcher,
    actions.nomineeFlow.stopNomineeRequestsWatcher,
    nomineeRequestsWatcher,
  );
}
