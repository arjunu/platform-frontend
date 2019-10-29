import { Effect, fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { actions, TActionFromCreator } from "../actions";
import { neuTakeEvery } from "../sagasUtils";
import { LocationChangeAction } from "connected-react-router";
import { selectIsAuthorized, selectUserType } from "../auth/selectors";
import { appRoutes } from "../../components/appRoutes";
import { EUserType } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { waitForAppInit } from "../init/sagas";

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
  {payload:{location}}:LocationChangeAction
) {
  const appIsReady = yield waitForAppInit();
  const userIsAuthorized:boolean = yield select((state:IAppState) => selectIsAuthorized(state.auth));//todo refactor selector to use full state
  const userType:EUserType|undefined = yield select(selectUserType);

  if(appIsReady && userIsAuthorized && userType === EUserType.NOMINEE){
    if(location.pathname === appRoutes.dashboard ){
      yield put(actions.nomineeFlow.calculateNomineeTask())
    }
  }
}

export function* routingSagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, actions.routing.openInNewWindow, openInNewWindowSaga);
  yield fork(neuTakeEvery, '@@router/LOCATION_CHANGE', startLocationBasedSagas);
}
