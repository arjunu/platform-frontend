import { LocationChangeAction } from "connected-react-router";
import { Effect, fork, put, select } from "redux-saga/effects";
import { matchPath } from 'react-router';

import { appRoutes, TEtoViewByIdMatch, TEtoViewByPreviewCodeMatch } from "../../components/appRoutes";
import { TGlobalDependencies } from "../../di/setupBindings";
import { EUserType } from "../../lib/api/users/interfaces";
import { actions, TActionFromCreator } from "../actions";
import { selectIsAuthorized, selectUserType } from "../auth/selectors";
import { waitForAppInit } from "../init/sagas";
import { neuCall, neuTakeEvery } from "../sagasUtils";

//---------//
// const GREYP_PREVIEW_CODE = "1eb004fd-c44d-4bed-9e76-0e0858649587";
const GREYP_PREVIEW_CODE = "e2b6949e-951d-4e99-ac11-534fdad86a80";
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

export function* notAuthorizedRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
) {
  const greypMatch = yield matchPath<any>(payload.location.pathname, {path: appRoutes.greypWithJurisdiction})
  if(greypMatch !== null){
    yield put(actions.etoView.loadNotAuthorizedEtoView(GREYP_PREVIEW_CODE, greypMatch))
  }
  const etoViewNotAuthorizedMatch = yield matchPath<TEtoViewByPreviewCodeMatch>(payload.location.pathname, { path: appRoutes.etoPublicView });
  const etoViewByIdNotAuthorizedMatch = yield matchPath<TEtoViewByIdMatch>(payload.location.pathname, { path: appRoutes.etoPublicViewById });

  if (etoViewNotAuthorizedMatch !== null) {
    const previewCode = etoViewNotAuthorizedMatch.params.previewCode;
    yield put(actions.etoView.loadNotAuthorizedEtoView(previewCode, etoViewNotAuthorizedMatch))
  }
  if (etoViewByIdNotAuthorizedMatch !== null) {
    const etoId = etoViewNotAuthorizedMatch.params.etoId;
    yield put(actions.etoView.loadNotAuthorizedEtoViewById(etoId, etoViewNotAuthorizedMatch))
  }
}

export function* investorRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
) {
  const greypMatch = yield matchPath<any>(payload.location.pathname, {path: appRoutes.greypWithJurisdiction})
  if(greypMatch !== null){
    yield put(actions.etoView.loadInvestorEtoView(GREYP_PREVIEW_CODE, greypMatch))
  }

  const etoViewInvestorMatch = yield matchPath<TEtoViewByPreviewCodeMatch>(payload.location.pathname, { path: appRoutes.etoPublicView });
  const etoViewByIdInvestorMatch = yield matchPath<TEtoViewByIdMatch>(payload.location.pathname, { path: appRoutes.etoPublicViewById });

  if (etoViewByIdInvestorMatch !== null) {
    const previewCode = etoViewByIdInvestorMatch.params.previewCode;
    yield put(actions.etoView.loadInvestorEtoViewById(previewCode, etoViewByIdInvestorMatch))
  }
  if (etoViewInvestorMatch !== null) {
    const previewCode = etoViewInvestorMatch.params.previewCode;
    yield put(actions.etoView.loadInvestorEtoView(previewCode, etoViewInvestorMatch))
  }
}

export function* issuerRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
) {
  const etoViewIssuerMatch = yield matchPath(payload.location.pathname, { path: appRoutes.etoIssuerView, exact: true });
  const etoViewIssuerPreviewMatch = yield matchPath(payload.location.pathname, { path: appRoutes.etoPublicView });
  if (etoViewIssuerMatch !== null) {
    yield put(actions.etoView.loadIssuerEtoView())
  } else if (etoViewIssuerPreviewMatch) {
    const previewCode = etoViewIssuerPreviewMatch.params.previewCode;
    yield put(actions.etoView.loadIssuerPreviewEtoView(previewCode,etoViewIssuerPreviewMatch))
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
    yield put(actions.nomineeFlow.loadNomineeEtoView());
  }
  if (payload.location.pathname === appRoutes.documents) {
    yield put(actions.nomineeFlow.nomineeDocumentsView());
  }
}

export function* routingSagas(): Iterator<Effect> {
  yield fork(neuTakeEvery, actions.routing.openInNewWindow, openInNewWindowSaga);
  yield fork(neuTakeEvery, "@@router/LOCATION_CHANGE", startRouteBasedSagas);
}
