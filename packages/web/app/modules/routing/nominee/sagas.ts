import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import { appRoutes } from "../../../components/appRoutes";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { neuCall } from "../../sagasUtils";
import { fallbackRedirect, redirectLegacyEtoView } from "../sagas";

export function* nomineeRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  const dashboardMatch = yield matchPath<{}>(payload.location.pathname, {
    path: appRoutes.dashboard,
  });
  if (dashboardMatch) {
    return yield put(actions.nomineeFlow.nomineeDashboardView());
  }

  const etoViewStatsMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.etoIssuerViewStats,
    exact: true,
  });
  if (etoViewStatsMatch !== null) {
    return yield put(actions.etoView.loadNomineeEtoView(etoViewStatsMatch));
  }

  const legacyEtoViewRedirected = yield neuCall(redirectLegacyEtoView, payload.location);
  if (legacyEtoViewRedirected) {
    return;
  }

  const etoViewMatch = yield matchPath<{}>(payload.location.pathname, {
    path: appRoutes.etoIssuerView,
  });
  if (etoViewMatch) {
    return yield put(actions.etoView.loadNomineeEtoView(etoViewMatch));
  }

  const documentsMatch = yield matchPath<{}>(payload.location.pathname, {
    path: appRoutes.documents,
  });
  if (documentsMatch) {
    return yield put(actions.nomineeFlow.nomineeDocumentsView());
  }

  yield neuCall(fallbackRedirect, payload.location);
}
