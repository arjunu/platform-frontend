import { LocationChangeAction } from "connected-react-router";
import { Effect, fork, put, select } from "redux-saga/effects";
import { matchPath } from 'react-router';

import { appRoutes } from "../../components/appRoutes";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions, TActionFromCreator } from "../actions";
import { selectIsAuthorized, selectUserType } from "../auth/selectors";
import { waitForAppInit } from "../init/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";

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
  console.log("---startRouteBasedSagas")
  const appIsReady = yield waitForAppInit();
  const userIsAuthorized: boolean = yield select(selectIsAuthorized);
  const userType: EUserType | undefined = yield select(selectUserType);

  console.log(`userIsAuthorized: ${userIsAuthorized.toString()}, userType: ${userType}, route: ${
      action.payload.location.pathname
    }`,
  )
  logger.info(
    `userIsAuthorized: ${userIsAuthorized.toString()}, userType: ${userType}, route: ${
      action.payload.location.pathname
    }`,
  );

  if (appIsReady && !userIsAuthorized) {
    // yield neuCall(nonAuthorizedRouting, action);
  }

  if (appIsReady && userIsAuthorized && userType === EUserType.INVESTOR) {
    yield neuCall(investorRouting, action);
  }

  if (appIsReady && userIsAuthorized && userType === EUserType.ISSUER) {
    // yield neuCall(issuerRouting, action);
  }

  if (appIsReady && userIsAuthorized && userType === EUserType.NOMINEE) {
    yield neuCall(nomineeRouting, action);
  }
}

export function* investorRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
) {
  const etoInvestorView = yield matchPath<{previewCode:string, jurisdiction:EJurisdiction}>(payload.location.pathname, { path: appRoutes.etoInvestorView });
  if (etoInvestorView !== null) {
    const previewCode = etoInvestorView.params.previewCode;
    yield put(actions.etoView.loadInvestorEtoView(previewCode))
  }
}

export function* nomineeRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
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

export function* routingSagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, actions.routing.openInNewWindow, openInNewWindowSaga);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", startRouteBasedSagas);
}
