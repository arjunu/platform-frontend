import BigNumber from "bignumber.js";
import { isEmpty } from "lodash/fp";
import { delay, Effect } from "redux-saga";
import { all, fork, put, select, take } from "redux-saga/effects";

import { getNomineeRequestComponentState } from "../../components/nominee-dashboard/linkToIssuer/utils";
import {
  EEtoNomineeActiveEtoNotifications,
  ENomineeRequestErrorNotifications,
  EtoMessage,
} from "../../components/translatedMessages/messages";
import { createMessage } from "../../components/translatedMessages/utils";
import {
  NOMINEE_RECALCULATE_TASKS_DELAY,
  NOMINEE_REQUESTS_WATCHER_DELAY,
} from "../../config/constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EEtoState, TNomineeRequestResponse } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IssuerIdInvalid, NomineeRequestExists } from "../../lib/api/eto/EtoNomineeApi";
import { Dictionary } from "../../types";
import { nonNullable } from "../../utils/nonNullable";
import { actions, TActionFromCreator } from "../actions";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { selectIsBankAccountVerified } from "../bank-transfer-flow/selectors";
import { getEtoContract, loadCapitalIncrease, loadInvestmentAgreement } from "../eto/sagas";
import { selectEtoSubStateEtoEtoWithContract } from "../eto/selectors";
import { EEtoAgreementStatus, EETOStateOnChain, TEtoWithCompanyAndContract } from "../eto/types";
import { isOnChain } from "../eto/utils";
import { loadBankAccountDetails } from "../kyc/sagas";
import { neuCall, neuTakeLatest, neuTakeLatestUntil } from "../sagasUtils";
import { EAgreementType } from "../tx/transactions/nominee/sign-agreement/types";
import { selectLiquidEuroTokenBalance } from "../wallet/selectors";
import { TTaskSpecificData } from "./reducer";
import {
  selectActiveEtoPreviewCodeFromQueryString,
  selectActiveNomineeEto,
  selectIsISHASignedByIssuer,
  selectNomineeActiveEtoPreviewCode,
  selectNomineeEtoDocumentsStatus,
  selectNomineeEtos,
  selectNomineeRequests,
  selectNomineeStateError,
  selectNomineeTasksStatus,
} from "./selectors";
import {
  ENomineeEtoSpecificTask,
  ENomineeRequestError,
  ENomineeTask,
  ENomineeTaskStatus,
  ERedeemShareCapitalTaskSubstate,
  INomineeRequest,
  TNomineeRequestStorage,
} from "./types";
import {
  getNomineeTaskStep,
  nomineeApiDataToNomineeRequests,
  nomineeRequestResponseToRequestStatus,
  takeLatestNomineeRequest,
} from "./utils";

export function* initNomineeEtoSpecificTasks(
  { logger, notificationCenter }: TGlobalDependencies,
  eto: TEtoWithCompanyAndContract,
): Iterator<any> {
  try {
    const nomineeEtoSpecificTasks = {
      [ENomineeEtoSpecificTask.ACCEPT_THA]: ENomineeTaskStatus.NOT_DONE,
      [ENomineeEtoSpecificTask.ACCEPT_RAAA]: ENomineeTaskStatus.NOT_DONE,
      [ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]: ENomineeTaskStatus.NOT_DONE,
      [ENomineeEtoSpecificTask.ACCEPT_ISHA]: ENomineeTaskStatus.NOT_DONE,
    };

    if (isOnChain(eto)) {
      yield put(actions.eto.loadEtoAgreementsStatus(eto));
      yield take(actions.eto.setAgreementsStatus);

      const documentsStatus = yield select(selectNomineeEtoDocumentsStatus, eto.previewCode);

      if (documentsStatus[EAgreementType.THA] === EEtoAgreementStatus.DONE) {
        nomineeEtoSpecificTasks[ENomineeEtoSpecificTask.ACCEPT_THA] = ENomineeTaskStatus.DONE;
      }

      if (documentsStatus[EAgreementType.RAAA] === EEtoAgreementStatus.DONE) {
        nomineeEtoSpecificTasks[ENomineeEtoSpecificTask.ACCEPT_RAAA] = ENomineeTaskStatus.DONE;
      }
    }

    if (isOnChain(eto) && eto.contract.timedState >= EETOStateOnChain.Signing) {
      yield neuCall(loadInvestmentAgreement, eto.etoId, eto.previewCode);

      const data = yield all({
        ishaIsSignedByIssuer: select(selectIsISHASignedByIssuer, eto.previewCode),
      });

      if (data.ishaIsSignedByIssuer) {
        nomineeEtoSpecificTasks[ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL] =
          ENomineeTaskStatus.DONE;
      }
    }

    if (isOnChain(eto) && eto.contract.timedState > EETOStateOnChain.Signing) {
      nomineeEtoSpecificTasks[ENomineeEtoSpecificTask.ACCEPT_ISHA] = ENomineeTaskStatus.DONE;
    }

    return nomineeEtoSpecificTasks;
  } catch (e) {
    logger.error("error in initNomineeTasks", e);
    notificationCenter.error(
      createMessage(ENomineeRequestErrorNotifications.FETCH_NOMINEE_DATA_ERROR),
    );
  }
}

export function* initNomineeTasks({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  try {
    const nomineeTasksStatus = {
      [ENomineeTask.ACCOUNT_SETUP]: ENomineeTaskStatus.NOT_DONE,
      [ENomineeTask.LINK_BANK_ACCOUNT]: ENomineeTaskStatus.NOT_DONE,
      [ENomineeTask.LINK_TO_ISSUER]: ENomineeTaskStatus.NOT_DONE,
      [ENomineeTask.NONE]: ENomineeTaskStatus.NOT_DONE,
      byPreviewCode: {},
    };

    const userIsVerified: ReturnType<typeof selectIsUserFullyVerified> = yield select(
      selectIsUserFullyVerified,
    );
    if (!userIsVerified) {
      yield put(actions.nomineeFlow.storeNomineeTasksStatus(nomineeTasksStatus)); //no reason to go further
      return;
    } else {
      nomineeTasksStatus[ENomineeTask.ACCOUNT_SETUP] = ENomineeTaskStatus.DONE;

      yield all([neuCall(loadBankAccountDetails), neuCall(loadNomineeEtos)]);

      const result = yield all({
        bankAccountIsVerified: select(selectIsBankAccountVerified),
        nomineeEtos: select(selectNomineeEtos),
      });

      if (result.bankAccountIsVerified) {
        nomineeTasksStatus[ENomineeTask.LINK_BANK_ACCOUNT] = ENomineeTaskStatus.DONE;
      }
      if (!result.nomineeEtos || isEmpty(result.nomineeEtos)) {
        yield put(actions.nomineeFlow.storeNomineeTasksStatus(nomineeTasksStatus));
        return;
      } else {
        nomineeTasksStatus[ENomineeTask.LINK_TO_ISSUER] = ENomineeTaskStatus.DONE;
      }

      nomineeTasksStatus.byPreviewCode = yield all(
        //todo we need this all the time, write a utils fn for this
        Object.keys(result.nomineeEtos).reduce(
          (acc: { [key: string]: Iterator<Effect> }, previewCode: string) => {
            acc[previewCode] = neuCall(
              initNomineeEtoSpecificTasks,
              result.nomineeEtos[previewCode],
            );
            return acc;
          },
          {} as { [key: string]: Iterator<Effect> },
        ),
      );

      yield put(actions.nomineeFlow.storeNomineeTasksStatus(nomineeTasksStatus));
    }
  } catch (e) {
    logger.error("error in initNomineeTasks", e);
    notificationCenter.error(
      createMessage(ENomineeRequestErrorNotifications.FETCH_NOMINEE_DATA_ERROR),
    );
  }
}

export function* nomineeDashboardView({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(initNomineeTasks);

    const selectStepReq: { [key: string]: Effect } = {
      nomineeTasksStatus: select(selectNomineeTasksStatus),
    };

    //check the conditions and start watchers  here
    const verificationIsComplete = yield select(selectIsUserFullyVerified);

    if (verificationIsComplete) {
      yield all({
        startRequestWatcher: put(actions.nomineeFlow.startNomineeRequestsWatcher()),
        setActiveEto: neuCall(setActiveNomineeEto),
      });

      selectStepReq.activeEtoPreviewCode = select(selectNomineeActiveEtoPreviewCode);
      selectStepReq.nomineeEtos = select(selectNomineeEtos);
    }
    const selectStepData = yield all(selectStepReq);

    const activeNomineeTask: ENomineeTask | ENomineeEtoSpecificTask = yield getNomineeTaskStep(
      selectStepData,
    );

    const taskSpecificData = yield neuCall(getTaskSpecificData, activeNomineeTask);

    yield put(actions.nomineeFlow.startNomineeTaskWatcher());
    yield put(actions.nomineeFlow.storeActiveNomineeTask(activeNomineeTask, taskSpecificData));
  } catch (e) {
    logger.error(e);
    //TODO save error to state and show and error UI
  }
}

export type TGetRedeemShareCapitalTaskStateParams = {
  capitalIncrease: string;
  walletBalance: string;
};

export function* getRedeemShareCapitalTaskState(
  _: TGlobalDependencies,
  { capitalIncrease, walletBalance }: TGetRedeemShareCapitalTaskStateParams,
): Iterator<any> {
  // capital increase is transferred to Nominee's wallet automatically when eto enters signing state.
  // if wallet balance is less than capital increase, we ASSUME here that capital increase already
  // has been transferred to the issuer's bank account and nominee now has to wait until issuer signs the ISHA.
  // this won't work with multiple nominee etos but ok for now.
  // When issuer signs the isha, nominee flow will go to the next stage - ACCEPT_ISHA
  // @see https://github.com/Neufund/platform-frontend/issues/3320, technical notes
  if (new BigNumber(walletBalance).lessThan(capitalIncrease)) {
    return ERedeemShareCapitalTaskSubstate.WAITING_FOR_ISSUER_TO_SIGN_ISHA;
  } else {
    return ERedeemShareCapitalTaskSubstate.REDEEM_CAPITAL_INCREASE;
  }
}

export function* getTaskSpecificData(
  _: TGlobalDependencies,
  activeNomineeTask: ENomineeTask | ENomineeEtoSpecificTask,
): Iterator<any> {
  const taskSpecificData: TTaskSpecificData = { byPreviewCode: {} };

  if (activeNomineeTask === ENomineeTask.LINK_TO_ISSUER) {
    //nomineeRequestsWatcher fires every 10 seconds but we need this data right now
    yield neuCall(loadNomineeRequests);

    const data = yield all({
      nomineeEto: select(selectActiveNomineeEto),
      nomineeRequest: select(selectNomineeRequests),
      nomineeRequestError: select(selectNomineeStateError),
    });
    const dataConverted = {
      ...data,
      nomineeRequest: takeLatestNomineeRequest(data.nomineeRequest),
    };
    //todo move account setup step calculations here

    taskSpecificData[ENomineeTask.LINK_TO_ISSUER] = {
      nextState: yield getNomineeRequestComponentState(dataConverted),
    };
  }
  if (activeNomineeTask === ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL) {
    const nomineeEto: TEtoWithCompanyAndContract = yield select(selectActiveNomineeEto);
    const capitalIncrease: string = yield neuCall(loadCapitalIncrease, nomineeEto.etoId);
    const walletBalance: string = yield select(selectLiquidEuroTokenBalance);
    const taskSubstate: ERedeemShareCapitalTaskSubstate = yield neuCall(
      getRedeemShareCapitalTaskState,
      { capitalIncrease, walletBalance },
    );

    taskSpecificData.byPreviewCode[nomineeEto.previewCode] = {
      [ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]: {
        capitalIncrease,
        walletBalance,
        taskSubstate,
      },
    };
  }
  return taskSpecificData;
}

export function* nomineeEtoView({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    const verificationIsComplete = yield select(selectIsUserFullyVerified);
    if (verificationIsComplete) {
      yield neuCall(loadActiveNomineeEto);
    }
  } catch (e) {
    logger.error(e);
    //TODO save error to state and show and error UI
  }
}

export function* nomineeDocumentsView({ logger }: TGlobalDependencies): Iterator<any> {
  try {
    const verificationIsComplete = yield select(selectIsUserFullyVerified);
    if (verificationIsComplete) {
      yield neuCall(loadActiveNomineeEto);
    }
  } catch (e) {
    logger.error(e);
    //TODO save error to state and show and error UI
  }
}

export function* loadActiveNomineeEto(): IterableIterator<any> {
  yield neuCall(loadNomineeEtos);
  yield neuCall(setActiveNomineeEto);
}

export function* nomineeTasksWatcher({ logger }: TGlobalDependencies): Iterator<any> {
  while (true) {
    logger.info("Getting nominee tasks");
    yield put(actions.nomineeFlow.initNomineeTasks());
    yield delay(NOMINEE_RECALCULATE_TASKS_DELAY);
  }
}

export function* nomineeRequestsWatcher({ logger }: TGlobalDependencies): Iterator<any> {
  while (true) {
    logger.info("Getting nominee requests");
    yield put(actions.nomineeFlow.loadNomineeRequests());
    yield delay(NOMINEE_REQUESTS_WATCHER_DELAY);
  }
}

export function* loadNomineeRequests({
  apiEtoNomineeService,
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  logger.info("---loading nominee requests");
  try {
    const nomineeRequests = yield apiEtoNomineeService.getNomineeRequests();
    const nomineeRequestsConverted: TNomineeRequestStorage = yield nomineeApiDataToNomineeRequests(
      nomineeRequests,
    );
    yield put(actions.nomineeFlow.setNomineeRequests(nomineeRequestsConverted));
  } catch (e) {
    notificationCenter.error(
      createMessage(ENomineeRequestErrorNotifications.FETCH_NOMINEE_DATA_ERROR),
    );

    logger.error("Error while loading nominee requests", e);
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
  _: TGlobalDependencies,
  eto: TEtoWithCompanyAndContract,
): Iterator<any> {
  if (eto.state === EEtoState.ON_CHAIN) {
    eto.contract = yield neuCall(getEtoContract, eto.etoId, eto.state);
  }

  eto.subState = yield select(selectEtoSubStateEtoEtoWithContract, eto);
  return eto;
}

export function* loadNomineeEtos({
  apiEtoService,
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterable<any> {
  try {
    const etos: TEtoWithCompanyAndContract[] = yield apiEtoService.loadNomineeEtos();
    const etosByPreviewCode: Dictionary<TEtoWithCompanyAndContract, string> = yield all(
      etos.reduce(
        (acc: { [key: string]: Iterator<Effect> }, eto: TEtoWithCompanyAndContract) => {
          acc[eto.previewCode] = neuCall(loadNomineeEto, eto);
          return acc;
        },
        {} as { [key: string]: Iterator<Effect> },
      ),
    );

    yield put(actions.nomineeFlow.setNomineeEtos({ etos: etosByPreviewCode }));
  } catch (e) {
    logger.error("Nominee ETOs could not be loaded", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETOS));
    //TODO save error to state and show and error UI
  }
}

export function* setActiveNomineeEto({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterable<any> {
  try {
    const etos: ReturnType<typeof selectNomineeEtos> = yield select(selectNomineeEtos);

    if (etos === undefined || isEmpty(etos)) {
      yield put(actions.nomineeFlow.setActiveNomineeEtoPreviewCode(undefined));
    } else {
      const forcedActiveEtoPreviewCode: ReturnType<
        typeof selectActiveEtoPreviewCodeFromQueryString
      > = yield select(selectActiveEtoPreviewCodeFromQueryString);

      // For testing purpose we can force another ETO to be active (by default it's the first one)
      const shouldForceSpecificEtoToBeActive =
        forcedActiveEtoPreviewCode !== undefined && etos[forcedActiveEtoPreviewCode] !== undefined;

      if (shouldForceSpecificEtoToBeActive) {
        yield put(actions.nomineeFlow.setActiveNomineeEtoPreviewCode(forcedActiveEtoPreviewCode));

        notificationCenter.info(
          createMessage(EEtoNomineeActiveEtoNotifications.ACTIVE_ETO_SET_SUCCESS),
        );
      } else {
        const firstEto = nonNullable(Object.values(etos)[0]);
        yield put(actions.nomineeFlow.setActiveNomineeEtoPreviewCode(firstEto.previewCode));
      }
    }
  } catch (e) {
    logger.fatal("Could not set active eto", e);

    notificationCenter.error(createMessage(EEtoNomineeActiveEtoNotifications.ACTIVE_ETO_SET_ERROR));
    //TODO save error to state and show and error UI
  }
}

export function* nomineeFlowSagas(): Iterator<any> {
  yield fork(
    neuTakeLatestUntil,
    actions.nomineeFlow.nomineeDashboardView,
    "@@router/LOCATION_CHANGE",
    nomineeDashboardView,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.nomineeFlow.nomineeEtoView,
    "@@router/LOCATION_CHANGE",
    nomineeEtoView,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.nomineeFlow.nomineeDocumentsView,
    "@@router/LOCATION_CHANGE",
    nomineeDocumentsView,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.nomineeFlow.initNomineeTasks,
    "@@router/LOCATION_CHANGE",
    initNomineeTasks,
  );
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeEtos, loadNomineeEtos);
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeRequests, loadNomineeRequests);
  yield fork(neuTakeLatest, actions.nomineeFlow.createNomineeRequest, createNomineeRequest);
  yield fork(
    neuTakeLatest,
    actions.nomineeFlow.startSetingActiveNomineeEtoPreviewCode,
    setActiveNomineeEto,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.nomineeFlow.startNomineeRequestsWatcher,
    [actions.nomineeFlow.stopNomineeRequestsWatcher, "@@router/LOCATION_CHANGE"],
    nomineeRequestsWatcher,
  );
  yield fork(
    neuTakeLatestUntil,
    actions.nomineeFlow.startNomineeTaskWatcher,
    [actions.nomineeFlow.stopNomineeTaskWatcher, "@@router/LOCATION_CHANGE"],
    nomineeTasksWatcher,
  );
}
