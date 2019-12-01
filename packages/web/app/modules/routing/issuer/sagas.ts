import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import { appRoutes } from "../../../components/appRoutes";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";

export function* issuerRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  const etoViewIssuerMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.etoIssuerView,
    exact: true,
  });
  const etoViewIssuerPreviewMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.etoPublicView,
  });
  if (etoViewIssuerMatch !== null) {
    yield put(actions.etoView.loadIssuerEtoView());
  } else if (etoViewIssuerPreviewMatch) {
    const previewCode = etoViewIssuerPreviewMatch.params.previewCode;
    yield put(actions.etoView.loadIssuerPreviewEtoView(previewCode, etoViewIssuerPreviewMatch));
  }
}
