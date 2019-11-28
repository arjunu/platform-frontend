import { LocationChangeAction } from "connected-react-router";
import { Effect, fork, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions, TActionFromCreator } from "../actions";
import { selectIsAuthorized, selectUserType } from "../auth/selectors";
import { waitForAppInit } from "../init/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { notAuthorizedRouting } from "./notAuth/sagas";
import { investorRouting } from "./investor/sagas";
import { issuerRouting } from "./issuer/sagas";
import { nomineeRouting } from "./nominee/sagas";

//---------//
// export const GREYP_PREVIEW_CODE = "1eb004fd-c44d-4bed-9e76-0e0858649587";
export const GREYP_PREVIEW_CODE = "e2b6949e-951d-4e99-ac11-534fdad86a80";
//---------//

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

export function* startRouteBasedSagas(
  { logger }: TGlobalDependencies,
  action: LocationChangeAction,
): IterableIterator<any> {

  const appIsReady = yield waitForAppInit();
  const userIsAuthorized: boolean = yield select(selectIsAuthorized);
  const userType: EUserType | undefined = yield select(selectUserType);

  console.log(`userIsAuthorized: ${userIsAuthorized.toString()}, userType: ${userType}, route: ${
      action.payload.location.pathname
    }`,
  );

  logger.info(
    `userIsAuthorized: ${userIsAuthorized.toString()}, userType: ${userType}, route: ${
      action.payload.location.pathname
    }`,
  );

  if (appIsReady && !userIsAuthorized) {
    yield neuCall(notAuthorizedRouting, action);
  }

  if (appIsReady && userIsAuthorized && userType === EUserType.INVESTOR) {
    yield neuCall(investorRouting, action);
  }

  if (appIsReady && userIsAuthorized && userType === EUserType.ISSUER) {
    yield neuCall(issuerRouting, action);
  }

  if (appIsReady && userIsAuthorized && userType === EUserType.NOMINEE) {
    yield neuCall(nomineeRouting, action);
  }
}


export function* routingSagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, actions.routing.openInNewWindow, openInNewWindowSaga);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", startRouteBasedSagas);
}
