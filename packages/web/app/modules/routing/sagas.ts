import { LocationChangeAction } from "connected-react-router";
import { Effect, fork, put, select } from "redux-saga/effects";

import { appRoutes } from "../../components/appRoutes";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { actions, TActionFromCreator } from "../actions";
import { selectIsAuthorized, selectUserType } from "../auth/selectors";
import { waitForAppInit } from "../init/sagas";
import { neuTakeEvery } from "../sagasUtils";

function* openInNewWindowSaga(
  _: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.routing.openInNewWindow>,
): Iterator<any> {
  const { path } = action.payload;

  //Open the popup and set the opener and referrer policy instruction
  const newWindow = window.open(path, "_blank", "noopener,noreferrer");

  //Reset the opener link
  if (newWindow) {
    newWindow.opener = null;
  }
}

function* startLocationBasedSagas(
  _: TGlobalDependencies,
  { payload: { location } }: LocationChangeAction,
): Iterator<any> {
  const appIsReady = yield waitForAppInit();
  const userIsAuthorized: boolean = yield select((state: IAppState) =>
    selectIsAuthorized(state.auth),
  ); //todo refactor selector to use full state
  const userType: EUserType | undefined = yield select(selectUserType);

  if (appIsReady && userIsAuthorized && userType === EUserType.NOMINEE) {
    if (location.pathname === appRoutes.dashboard) {
      yield put(actions.nomineeFlow.calculateNomineeTask());
    }
  }
}

export function* routingSagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, actions.routing.openInNewWindow, openInNewWindowSaga);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", startLocationBasedSagas);
}
