import { LocationChangeAction } from "connected-react-router";
import { SagaIterator } from "redux-saga";
import { select } from "typed-redux-saga";
import { Location } from "history";
import { matchPath } from "react-router";
import { fork, put } from "redux-saga/effects";

import {
  appRoutes,

} from "../../components/appRoutes";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions, TActionFromCreator } from "../actions";
import { selectIsAuthorized, selectUserType } from "../auth/selectors";
import { TEtoWithCompanyAndContract } from "../eto/types";
import { waitForAppInit } from "../init/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";
import { investorRouting } from "./investor/sagas";
import { issuerRouting } from "./issuer/sagas";
import { nomineeRouting } from "./nominee/sagas";
import { notAuthorizedRouting } from "./notAuth/sagas";
import { TEtoPublicViewByIdLegacyRoute, TEtoPublicViewLegacyRouteMatch } from "./types";

//---------//
// export const GREYP_PREVIEW_CODE = "1eb004fd-c44d-4bed-9e76-0e0858649587";
export const GREYP_PREVIEW_CODE = "e2b6949e-951d-4e99-ac11-534fdad86a80";
//---------//

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

export function* ensureEtoJurisdiction(
  etoJurisdiction: EJurisdiction,
  routJurisdiction: EJurisdiction,
): Generator<any,any,any> {
  if (etoJurisdiction !== routJurisdiction) {
    // TODO: Add 404 page
    yield put(actions.routing.goTo404());
  }
}

export function* redirectLegacyEtoView(
  { apiEtoService }: TGlobalDependencies,
  location: Location,
): Generator<any,any,any> {
  const etoPublicViewLegacyRouteMatch = yield matchPath<TEtoPublicViewLegacyRouteMatch>(
    location.pathname,
    {
      path: appRoutes.etoPublicViewLegacyRoute,
      exact: true,
    },
  );

  if (etoPublicViewLegacyRouteMatch !== null) {
    const previewCode = yield etoPublicViewLegacyRouteMatch.params.previewCode;
    const eto: TEtoWithCompanyAndContract = yield apiEtoService.getEtoPreview(previewCode);
    yield put(actions.routing.goToEtoView(previewCode, eto.product.jurisdiction));
    return true;
  }
}

export function* redirectLegacyEtoViewById(
  { apiEtoService }: TGlobalDependencies,
  location: Location,
): Generator<any,any,any> {
  const etoPublicViewByIdLegacyRouteMatch = yield matchPath<TEtoPublicViewByIdLegacyRoute>(
    location.pathname,
    {
      path: appRoutes.etoPublicViewByIdLegacyRoute,
      exact: true,
    },
  );
  if (etoPublicViewByIdLegacyRouteMatch !== null) {
    const etoId = etoPublicViewByIdLegacyRouteMatch.params.etoId;
    const eto: TEtoWithCompanyAndContract = yield apiEtoService.getEto(etoId);
    yield put(actions.routing.goToEtoViewById(etoId, eto.product.jurisdiction));
    return true;
  }
}

export function* redirectGreypWithoutJurisdiction(
  _: TGlobalDependencies,
  location: Location,
): Generator<any,any,any> {
  const greypWithoutJurisdictionMatch = yield matchPath<any>(location.pathname, {
    path: appRoutes.greyp,
  });
  if (greypWithoutJurisdictionMatch !== null) {
    yield put(actions.routing.goToGreypWithJurisdiction());
  }
}

// TODO this is a workaround to have a catch-all during the time we still use react-router and saga routing together
export function* fallbackRedirect(_: TGlobalDependencies, location: Location): Generator<any,any,any> {
  const fallbackMatch = yield matchPath(location.pathname, {
    path: appRoutes.dashboard,
    exact: true,
  });
  if (!fallbackMatch) {
    yield put(actions.routing.goToDashboard());
    return true;
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

export function* routingSagas(): SagaIterator<void> {
  yield fork(neuTakeEvery, actions.routing.openInNewWindow, openInNewWindowSaga);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", startRouteBasedSagas);
}
