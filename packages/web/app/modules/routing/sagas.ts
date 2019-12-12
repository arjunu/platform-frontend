import { fork, put, SagaIterator, select } from "@neufund/sagas";
import { LocationChangeAction } from "connected-react-router";

import { appRoutes } from "../../components/appRoutes";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions, TActionFromCreator } from "../actions";
import { selectIsAuthorized, selectUserType } from "../auth/selectors";
import { waitForAppInit } from "../init/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";

function* openInNewWindowSaga(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.routing.openInNewWindow>,
): Generator<any, any, any> {
  const { path } = action.payload;

  //Open the popup and set the opener and referrer policy instruction
  const newWindow = window.open(path, "_blank", "noopener,noreferrer");

  //Reset the opener link
  if (newWindow) {
    newWindow.opener = null;
  }
}

export function* startRouteBasedSagas(
  { logger }: TGlobalDependencies,
  action: LocationChangeAction,
): Generator<any, any, any> {
  const appIsReady = yield waitForAppInit();
  const userIsAuthorized = yield* select(selectIsAuthorized);
  const userType = yield* select(selectUserType);

  logger.info(
    `userIsAuthorized: ${userIsAuthorized.toString()}, userType: ${userType}, route: ${
      action.payload.location.pathname
    }`,
  );

  if (appIsReady && userIsAuthorized && userType === EUserType.NOMINEE) {
    yield neuCall(nomineeRouting, action);
  }
}

export function* nomineeRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Generator<any, any, any> {
  if (payload.location.pathname === appRoutes.dashboard) {
    yield put(actions.nomineeFlow.nomineeDashboardView());
  }
  if (payload.location.pathname === appRoutes.etoIssuerView) {
    yield put(actions.nomineeFlow.nomineeEtoView());
  }
  if (payload.location.pathname === appRoutes.documents) {
    yield put(actions.nomineeFlow.nomineeDocumentsView());
  }
}

export function* routingSagas(): SagaIterator<void> {
  yield fork(neuTakeEvery, actions.routing.openInNewWindow, openInNewWindowSaga);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", startRouteBasedSagas);
}
