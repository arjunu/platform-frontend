import { TGlobalDependencies } from "../../di/setupBindings";
import { fork, put } from "redux-saga/effects";
import { actions, TActionFromCreator } from "../actions";
import { ENomineeLinkRequestStatus } from "./reducer";
import { neuTakeLatest } from "../sagasUtils";
import { createMessage } from "../../components/translatedMessages/utils";
import { ENomineeLinkErrorNotifications } from "../../components/translatedMessages/messages";
import { TNomineeRequestResponse } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IssuerIdInvalid, NomineeRequestExists } from "../../lib/api/eto/EtoNomineeApi";


export function* loadNomineeTaskStatus({
  logger,
}: TGlobalDependencies): Iterator<any> {
  try {
    // const taskStatus = yield apiUserService.getNomineeLinkRequestStatus();
    // const eto: TEtoSpecsData = yield apiEtoService.getMyEto();
    //
    // if (eto.state === EEtoState.ON_CHAIN) {
    //   yield neuCall(loadEtoContract, eto);
    // }

  } catch (e) {
    logger.error("Failed to load Nominee tasks", e);
    // notificationCenter.error(createMessage(EtoFlowMessage.ETO_LOAD_FAILED));
    // yield put(actions.routing.goToDashboard());
  }
}

const NomineeRequestResponseToRequestStatus = (response: TNomineeRequestResponse) => {
  switch (response.state) {
    case "pending":
      return ENomineeLinkRequestStatus.PENDING;
    case "approved":
      return ENomineeLinkRequestStatus.APPROVED;
    case "rejected":
      return ENomineeLinkRequestStatus.REJECTED;
    default:
      throw new Error("invalid response")
  }
};

export function* createNomineeLinkRequest({
    apiEtoNomineeService,
    logger,
    notificationCenter
  }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.nomineeFlow.createNomineeRequest>,
): Iterator<any> {
  try {
    yield put(actions.nomineeFlow.startNomineeTasksRequest());


    const requestStatus: TNomineeRequestResponse =
      yield apiEtoNomineeService.createNomineeLinkRequest(action.payload.issuerId);
    const statusConverted: ENomineeLinkRequestStatus = NomineeRequestResponseToRequestStatus(requestStatus);

    yield put(actions.nomineeFlow.setNomineeLinkRequestStatus(statusConverted));
  } catch (e) {
    if (e instanceof IssuerIdInvalid) {
      logger.error("Failed to create nominee request, issuer id is invalid", e);
      yield put(actions.nomineeFlow.setNomineeLinkRequestStatus(ENomineeLinkRequestStatus.ISSUER_ID_ERROR));
      notificationCenter.error(createMessage(ENomineeLinkErrorNotifications.ISSUER_ID_ERROR));
    } else if (e instanceof NomineeRequestExists) {
      logger.error(`Nominee request to issuerId ${action.payload.issuerId} already exists`, e);
      yield put(actions.nomineeFlow.setNomineeLinkRequestStatus(ENomineeLinkRequestStatus.REQUEST_EXISTS));
      notificationCenter.error(createMessage(ENomineeLinkErrorNotifications.REQUEST_EXISTS));
    } else {
      logger.error("Failed to create nominee request", e);
      yield put(actions.nomineeFlow.setNomineeLinkRequestStatus(ENomineeLinkRequestStatus.GENERIC_ERROR));
      notificationCenter.error(createMessage(ENomineeLinkErrorNotifications.GENERIC_ERROR));
    }
  } finally {
    yield put(actions.routing.goToDashboard());
  }
}

export function* nomineeFlowSagas(): Iterator<any> {
  yield fork(neuTakeLatest, actions.nomineeFlow.createNomineeRequest, createNomineeLinkRequest);
}
