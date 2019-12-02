import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import { appRoutes } from "../../../components/appRoutes";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { neuCall } from "../../sagasUtils";
import { fallbackRedirect, redirectLegacyEtoView } from "../sagas";

export function* issuerRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  const etoViewStatsMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.etoIssuerViewStats,
    exact: true,
  });
  if (etoViewStatsMatch !== null) {
    return yield put(actions.etoView.loadIssuerEtoView());
  }

  const legacyEtoViewRedirected = yield neuCall(redirectLegacyEtoView, payload.location);
  if (legacyEtoViewRedirected) {
    return;
  }

  const etoViewMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.etoIssuerView,
    exact: true,
  });
  if (etoViewMatch !== null) {
    return yield put(actions.etoView.loadIssuerEtoView());
  }

  const etoViewIssuerPreviewMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.etoPublicView,
  });
  if (etoViewIssuerPreviewMatch) {
    const previewCode = etoViewIssuerPreviewMatch.params.previewCode;
    return yield put(
      actions.etoView.loadIssuerPreviewEtoView(previewCode, etoViewIssuerPreviewMatch),
    );
  }

  yield neuCall(fallbackRedirect, payload.location);
}
