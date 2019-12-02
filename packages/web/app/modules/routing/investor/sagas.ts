import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import {
  appRoutes,
  TEtoViewByIdMatch,
  TEtoViewByPreviewCodeMatch,
} from "../../../components/appRoutes";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { neuCall } from "../../sagasUtils";
import {
  fallbackRedirect,
  GREYP_PREVIEW_CODE,
  redirectGreypWithoutJurisdiction,
  redirectLegacyEtoView,
  redirectLegacyEtoViewById,
} from "../sagas";

export function* investorRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  /* --- REDIRECT LEGACY ROUTES ---*/
  const legacyEtoViewRedirected = yield neuCall(redirectLegacyEtoView, payload.location);
  if (legacyEtoViewRedirected) {
    return;
  }

  const legacyEtoViewByIdRedirected = yield neuCall(redirectLegacyEtoViewById, payload.location);
  if (legacyEtoViewByIdRedirected) {
    return;
  }

  /* --------- TEMP HARDCODED ROUTES ---------- */
  const greypWithoutJurisdictionRedirected = yield neuCall(
    redirectGreypWithoutJurisdiction,
    payload.location,
  );
  if (greypWithoutJurisdictionRedirected) {
    return;
  }

  const greypMatch = yield matchPath<any>(payload.location.pathname, {
    path: appRoutes.greypWithJurisdiction,
  });
  if (greypMatch !== null) {
    return yield put(actions.etoView.loadInvestorEtoView(GREYP_PREVIEW_CODE, greypMatch));
  }
  /* ----------------------------------------- */

  const etoViewByIdMatch = yield matchPath<TEtoViewByIdMatch>(payload.location.pathname, {
    path: appRoutes.etoPublicViewById,
  });
  if (etoViewByIdMatch !== null) {
    const etoId = yield etoViewByIdMatch.params.etoId;
    return yield put(actions.etoView.loadInvestorEtoViewById(etoId, etoViewByIdMatch));
  }

  const etoViewMatch = yield matchPath<TEtoViewByPreviewCodeMatch>(payload.location.pathname, {
    path: appRoutes.etoPublicView,
  });
  if (etoViewMatch !== null) {
    const previewCode = yield etoViewMatch.params.previewCode;
    return yield put(actions.etoView.loadInvestorEtoView(previewCode, etoViewMatch));
  }

  yield neuCall(fallbackRedirect, payload.location);
}
