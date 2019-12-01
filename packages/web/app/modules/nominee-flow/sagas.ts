import BigNumber from "bignumber.js";
import { cloneDeep, isEmpty } from "lodash/fp";
import { delay, Effect } from "redux-saga";
import { all, fork, put, select, take } from "redux-saga/effects";

import { hashFromIpfsLink } from "../../components/documents/utils";
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
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { Dictionary } from "../../types";
import { nonNullable } from "../../utils/nonNullable";
import { actions, TActionFromCreator } from "../actions";
import { selectIsUserFullyVerified } from "../auth/selectors";
import { selectIsBankAccountVerified } from "../bank-transfer-flow/selectors";
import {
  getEtoContract,
  loadAgreementsStatus,
  loadCapitalIncrease,
  loadInvestmentAgreement,
} from "../eto/sagas";
import { selectEtoSubStateEtoEtoWithContract } from "../eto/selectors";
import { EEtoAgreementStatus, EETOStateOnChain, TEtoWithCompanyAndContract } from "../eto/types";
import { isOnChain } from "../eto/utils";
import { loadBankAccountDetails } from "../kyc/sagas";
import { neuCall, neuTakeLatest, neuTakeLatestUntil } from "../sagasUtils";
import { EAgreementType } from "../tx/transactions/nominee/sign-agreement/types";
import { selectLiquidEuroTokenBalance } from "../wallet/selectors";
import {
  initalNomineeTaskStatus,
  initialEtoSpecificTaskData,
  initialNomineeEtoSpecificTaskStatus,
} from "./reducer";
import {
  selectActiveEtoPreviewCodeFromQueryString,
  selectActiveNomineeEto,
  selectEtoSpecificTaskData,
  selectEtoSpecificTasksStatus,
  selectIsISHASignedByIssuer,
  selectNomineeActiveEtoPreviewCode,
  selectNomineeEtoDocumentsStatus,
  selectNomineeEtos,
  selectNomineeRequestError,
  selectNomineeRequests,
  selectNomineeTasksData,
  selectNomineeTasksStatus,
} from "./selectors";
import {
  ENomineeEtoSpecificTask,
  ENomineeFlowError,
  ENomineeRequestError,
  ENomineeTask,
  ENomineeTaskStatus,
  ERedeemShareCapitalTaskSubstate,
  INomineeRequest,
  TNomineeEtoSpecificTasksStatus,
  TNomineeRequestStorage,
} from "./types";
import {
  generateIpfsHash,
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
      yield put(actions.nomineeFlow.nomineeLoadEtoAgreementsStatus(eto));
      yield take(actions.nomineeFlow.nomineeSetAgreementsStatus);

      const documentsStatus = yield select(selectNomineeEtoDocumentsStatus, eto.previewCode);

      if (documentsStatus[EAgreementType.THA] === EEtoAgreementStatus.DONE) {
        nomineeEtoSpecificTasks[ENomineeEtoSpecificTask.ACCEPT_THA] = ENomineeTaskStatus.DONE;
      }

      if (documentsStatus[EAgreementType.RAAA] === EEtoAgreementStatus.DONE) {
        nomineeEtoSpecificTasks[ENomineeEtoSpecificTask.ACCEPT_RAAA] = ENomineeTaskStatus.DONE;
      }
    }

    if (isOnChain(eto) && eto.contract.timedState >= EETOStateOnChain.Signing) {
      yield neuCall(
        nomineeFlowLoadInvestmentAgreement,
        actions.nomineeFlow.nomineeLoadSignedInvestmentAgreement(eto.etoId, eto.previewCode),
      );

      const ishaIsSignedByIssuer = yield select(selectIsISHASignedByIssuer, eto.previewCode);
      if (ishaIsSignedByIssuer) {
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

export function* getDataAndInitNomineeTasks(_: TGlobalDependencies): Iterator<any> {
  const nomineeTasksStatus = cloneDeep(initalNomineeTaskStatus);

  const userIsVerified: ReturnType<typeof selectIsUserFullyVerified> = yield select(
    selectIsUserFullyVerified,
  );
  if (!userIsVerified) {
    yield put(actions.nomineeFlow.storeNomineeTasksStatus(nomineeTasksStatus)); //no reason to go further
    return;
  } else {
    nomineeTasksStatus[ENomineeTask.ACCOUNT_SETUP] = ENomineeTaskStatus.DONE;

    yield all([neuCall(loadBankAccountDetails), neuCall(loadNomineeEtos)]);

    const data = yield all({
      bankAccountIsVerified: select(selectIsBankAccountVerified),
      nomineeEtos: select(selectNomineeEtos),
    });

    if (data.bankAccountIsVerified) {
      nomineeTasksStatus[ENomineeTask.LINK_BANK_ACCOUNT] = ENomineeTaskStatus.DONE;
    }
    if (isEmpty(data.nomineeEtos)) {
      yield put(actions.nomineeFlow.storeNomineeTasksStatus(nomineeTasksStatus));
      return;
    } else {
      nomineeTasksStatus[ENomineeTask.LINK_TO_ISSUER] = ENomineeTaskStatus.DONE;
    }

    let etoSpecificNomineeTaskStatusEffects: { [key: string]: Iterator<Effect> } = {};
    Object.keys(data.nomineeEtos).forEach((key: string) => {
      etoSpecificNomineeTaskStatusEffects[key] = neuCall(
        initNomineeEtoSpecificTasks,
        data.nomineeEtos[key],
      );
    });

    nomineeTasksStatus.byPreviewCode = yield all(etoSpecificNomineeTaskStatusEffects);

    yield put(actions.nomineeFlow.storeNomineeTasksStatus(nomineeTasksStatus));
  }
}

export function* initNomineeDashboardView(): Iterator<any> {
  yield neuCall(getDataAndInitNomineeTasks);

  const nomineeTasksStatus = yield select(selectNomineeTasksStatus);

  //check the conditions and start watchers  here
  const verificationIsComplete = yield select(selectIsUserFullyVerified);

  if (verificationIsComplete) {
    yield all({
      startRequestWatcher: put(actions.nomineeFlow.startNomineeRequestsWatcher()),
      setActiveEto: neuCall(setActiveNomineeEto),
    });
  }
  const selectStepData = yield all({
    activeEtoPreviewCode: select(selectNomineeActiveEtoPreviewCode),
    nomineeEtos: select(selectNomineeEtos),
  });

  const activeNomineeTask: ENomineeTask | ENomineeEtoSpecificTask = yield getNomineeTaskStep({
    ...selectStepData,
    nomineeTasksStatus,
  });

  const taskSpecificData = yield neuCall(getTaskSpecificData, activeNomineeTask);

  yield put(actions.nomineeFlow.storeActiveNomineeTask(activeNomineeTask, taskSpecificData));
}

export function* nomineeDashboardView({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  try {
    yield neuCall(nomineeViewDataWatcher);
  } catch (e) {
    logger.error(e);

    notificationCenter.error(
      createMessage(ENomineeRequestErrorNotifications.FETCH_NOMINEE_DATA_ERROR),
    );
    yield put(actions.nomineeFlow.storeError(ENomineeFlowError.FETCH_DATA_ERROR));
  }
}

export function* nomineeFlowLoadInvestmentAgreement(
  _: TGlobalDependencies,
  {
    payload: { etoId, previewCode },
  }: TActionFromCreator<typeof actions.nomineeFlow.nomineeLoadSignedInvestmentAgreement>,
): Iterator<any> {
  const url = yield neuCall(loadInvestmentAgreement, etoId);
  yield put(actions.nomineeFlow.nomineeSetInvestmentAgreementHash(previewCode, url));
}

export function* nomineeFlowLoadAgreementsStatus(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.nomineeFlow.nomineeLoadEtoAgreementsStatus>,
): Iterator<any> {
  const statuses: Dictionary<EEtoAgreementStatus, EAgreementType> = yield neuCall(
    loadAgreementsStatus,
    payload.eto,
  );

  yield put(actions.nomineeFlow.nomineeSetAgreementsStatus(payload.eto.previewCode, statuses));
}

export function* nomineeViewDataWatcher({ logger }: TGlobalDependencies): Iterator<any> {
  while (true) {
    logger.info("Getting nominee data and tasks");
    yield neuCall(initNomineeDashboardView);
    yield delay(NOMINEE_RECALCULATE_TASKS_DELAY);
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
  const taskSpecificData = cloneDeep(yield select(selectNomineeTasksData));

  if (activeNomineeTask === ENomineeTask.LINK_TO_ISSUER) {
    taskSpecificData[ENomineeTask.LINK_TO_ISSUER] = yield neuCall(getNomineeTaskLinkToIssuerData);
  }

  if (activeNomineeTask === ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL) {
    const { previewCode, etoId }: TEtoWithCompanyAndContract = yield select(selectActiveNomineeEto);

    taskSpecificData.byPreviewCode[previewCode] = yield neuCall(
      getNomineeTaskRedeemShareCapitalData,
      etoId,
      previewCode,
    );
  }

  return taskSpecificData;
}

export function* getNomineeTaskRedeemShareCapitalData(
  _: TGlobalDependencies,
  etoId: string,
  previewCode: string,
): Iterator<any> {
  const capitalIncrease: string = yield neuCall(
    loadCapitalIncrease,
    actions.eto.loadCapitalIncrease(etoId, previewCode),
  );
  const walletBalance: string = yield select(selectLiquidEuroTokenBalance);
  const taskSubstate: ERedeemShareCapitalTaskSubstate = yield neuCall(
    getRedeemShareCapitalTaskState,
    { capitalIncrease, walletBalance },
  );

  return {
    [ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]: {
      capitalIncrease,
      walletBalance,
      taskSubstate,
    },
  };
}

export function* getNomineeTaskLinkToIssuerData(_: TGlobalDependencies): Iterator<any> {
  yield neuCall(loadNomineeRequests); //nomineeRequestsWatcher fires every 10 seconds but we need this data right now

  const data = yield all({
    nomineeEto: select(selectActiveNomineeEto),
    nomineeRequest: select(selectNomineeRequests),
    nomineeRequestError: select(selectNomineeRequestError),
  });
  const dataConverted = {
    ...data,
    nomineeRequest: takeLatestNomineeRequest(data.nomineeRequest),
  };

  return {
    nextState: yield getNomineeRequestComponentState(dataConverted),
    error: data.nomineeRequstError,
  };
}

export function* nomineeDocumentsView({
  logger,
  notificationCenter,
}: TGlobalDependencies): Iterator<any> {
  try {
    const verificationIsComplete = yield select(selectIsUserFullyVerified);
    if (verificationIsComplete) {
      yield neuCall(loadActiveNomineeEto);
    }
  } catch (e) {
    logger.error(e);
    notificationCenter.error(
      createMessage(ENomineeRequestErrorNotifications.FETCH_NOMINEE_DATA_ERROR),
    );
    yield put(actions.nomineeFlow.storeError(ENomineeFlowError.FETCH_DATA_ERROR));
  }
}

export function* loadActiveNomineeEto(): IterableIterator<any> {
  yield neuCall(loadNomineeEtos);
  yield neuCall(setActiveNomineeEto);
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
    yield put(actions.nomineeFlow.nomineeLoadEtoAgreementsStatus(nomineeEto));
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

    let getEtoDataEffects: Dictionary<Iterator<Effect>, string> = {};
    let getEtoSpecificTaskStatusEffects: Dictionary<Iterator<Effect>, string> = {};
    let getEtoSpecificTaskDataEffects: Dictionary<Iterator<Effect>, string> = {};

    etos.forEach((eto: TEtoWithCompanyAndContract) => {
      getEtoDataEffects[eto.previewCode] = neuCall(loadNomineeEto, eto);
      getEtoSpecificTaskStatusEffects[eto.previewCode] = neuCall(
        initEtoSpecificTaskStatus,
        eto.previewCode,
      );
      getEtoSpecificTaskDataEffects[eto.previewCode] = neuCall(
        initEtoSpecificTaskData,
        eto.previewCode,
      );
    });

    const result = yield all({
      etoData: all(getEtoDataEffects),
      etoSpecificTaskStatus: all(getEtoSpecificTaskStatusEffects),
      etoSpecificTaskData: all(getEtoSpecificTaskDataEffects),
    });

    yield all([
      put(actions.nomineeFlow.setNomineeEtos({ etos: result.etoData })),
      put(actions.nomineeFlow.setNomineeEtoSpecificTasksData(result.etoSpecificTaskData)),
      put(actions.nomineeFlow.setNomineeEtoSpecificTasksStatus(result.etoSpecificTaskStatus)),
    ]);
  } catch (e) {
    logger.error("Nominee ETOs could not be loaded", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETOS));
    yield put(actions.nomineeFlow.storeError(ENomineeFlowError.LOAD_ETOS_ERROR));
  }
}

export function* initEtoSpecificTaskStatus(
  _: TGlobalDependencies,
  previewCode: string,
): Iterator<any> {
  const taskStatus: TNomineeEtoSpecificTasksStatus = yield select(
    selectEtoSpecificTasksStatus,
    previewCode,
  );
  return taskStatus === undefined ? cloneDeep(initialNomineeEtoSpecificTaskStatus) : taskStatus;
}

export function* initEtoSpecificTaskData(
  _: TGlobalDependencies,
  preivewCode: string,
): Iterator<any> {
  const taskData = yield select(selectEtoSpecificTaskData, preivewCode);
  return taskData === undefined ? cloneDeep(initialEtoSpecificTaskData) : taskData;
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
      const forcedActiveEtoPreviewCode: ReturnType<typeof selectActiveEtoPreviewCodeFromQueryString> = yield select(
        selectActiveEtoPreviewCodeFromQueryString,
      );

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
    yield put(actions.nomineeFlow.storeError(ENomineeFlowError.ACTIVE_ETO_SET_ERROR));
  }
}

export function* uploadAndCheckIsha(
  _: TGlobalDependencies,
  { payload: { file } }: TActionFromCreator<typeof actions.nomineeFlow.nomineeUploadIsha>,
): Iterator<any> {
  const nomineeEto = yield select(selectActiveNomineeEto);
  yield put(actions.nomineeFlow.nomineeIshaUploadInProgress(nomineeEto.etoId));

  const hashes = yield all({
    issuerIshaHash: neuCall(loadIshaHash, nomineeEto.etoId),
    nomineeIshaHash: generateIpfsHash(file),
  });

  if (hashes.issuerIshaHash === hashes.nomineeIshaHash) {
    yield put(actions.nomineeFlow.nomineeIshaCheckSuccess(nomineeEto.previewCode, file.name));
  } else {
    yield put(actions.nomineeFlow.nomineeIshaCheckError(nomineeEto.previewCode, file.name));
  }
}

export function* loadIshaHash(
  { contractsService }: TGlobalDependencies,
  etoId: string,
): Iterator<any> {
  const etoCommitmentContract: ETOCommitment = yield contractsService.getETOCommitmentContract(
    etoId,
  );
  const ishaUrl = yield etoCommitmentContract.signedInvestmentAgreementUrl;
  if (ishaUrl !== "") {
    return hashFromIpfsLink(ishaUrl);
  } else {
    throw new Error("isha hash is empty");
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
    actions.nomineeFlow.nomineeDocumentsView,
    "@@router/LOCATION_CHANGE",
    nomineeDocumentsView,
  );
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeEtos, loadNomineeEtos);
  yield fork(neuTakeLatest, actions.nomineeFlow.loadNomineeRequests, loadNomineeRequests);
  yield fork(neuTakeLatest, actions.nomineeFlow.createNomineeRequest, createNomineeRequest);
  yield fork(
    neuTakeLatest,
    actions.nomineeFlow.nomineeLoadEtoAgreementsStatus,
    nomineeFlowLoadAgreementsStatus,
  );
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
    actions.nomineeFlow.startNomineeViewWatcher,
    [actions.nomineeFlow.stopNomineeTaskWatcher, "@@router/LOCATION_CHANGE"],
    nomineeViewDataWatcher,
  );
  yield fork(neuTakeLatest, actions.nomineeFlow.nomineeUploadIsha, uploadAndCheckIsha);
}
