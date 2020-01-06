import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import {
  appRoutes,

} from "../../../components/appRoutes";
import { profileRoutes } from "../../../components/settings/routes";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { neuCall } from "../../sagasUtils";
import { fallbackRedirect, redirectLegacyEtoView, redirectLegacyEtoViewById } from "../sagas";
import { TEtoViewByIdMatch, TEtoViewByPreviewCodeMatch } from "../types";

export function* issuerRouting(
  { logger }: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  try {
    const etoViewStatsMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.etoIssuerViewStats,
      exact: true,
    });
    if (etoViewStatsMatch !== null) {
      return yield put(actions.etoView.loadIssuerEtoView());
    }

    /* --- REDIRECT LEGACY ROUTES ---*/
    const legacyEtoViewRedirected = yield neuCall(redirectLegacyEtoView, payload.location);
    if (legacyEtoViewRedirected) {
      return;
    }
    const legacyEtoViewByIdRedirected = yield neuCall(redirectLegacyEtoViewById, payload.location);
    if (legacyEtoViewByIdRedirected) {
      return;
    }
    /* ---------------*/

    const etoViewMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.etoIssuerView,
      exact: true,
    });
    if (etoViewMatch !== null) {
      return yield put(actions.etoView.loadIssuerEtoView());
    }

    const etoViewIssuerPreviewMatch = yield matchPath<TEtoViewByPreviewCodeMatch>(
      payload.location.pathname,
      {
        path: appRoutes.etoPublicView,
      },
    );
    if (etoViewIssuerPreviewMatch) {
      const previewCode = etoViewIssuerPreviewMatch.params.previewCode;
      return yield put(
        actions.etoView.loadIssuerPreviewEtoView(previewCode, etoViewIssuerPreviewMatch),
      );
    }

    const etoViewIssuerPreviewByIdMatch = yield matchPath<TEtoViewByIdMatch>(
      payload.location.pathname,
      {
        path: appRoutes.etoPublicViewById,
      },
    );
    if (etoViewIssuerPreviewByIdMatch) {
      const etoId = etoViewIssuerPreviewByIdMatch.params.etoId;
      return yield put(
        actions.etoView.loadIssuerPreviewEtoViewById(etoId, etoViewIssuerPreviewByIdMatch),
      );
    }

    // routes stubbed until we move them all to sagas and provide a meaningful action on match
    const etoWidgetViewMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.etoWidgetView,
    });
    if (etoWidgetViewMatch !== null) {
      return;
    }

    const unsubscriptionSuccessMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.unsubscriptionSuccess,
    });
    if (unsubscriptionSuccessMatch !== null) {
      return;
    }

    const unsubscriptionMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.unsubscription,
    });
    if (unsubscriptionMatch !== null) {
      return;
    }

    const dashboardMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.dashboard,
      exact: true,
    });
    if (dashboardMatch) {
      return;
    }

    const etoRegistrationMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.etoRegister,
    });
    if (etoRegistrationMatch) {
      return;
    }

    const documentsMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.documents,
    });
    if (documentsMatch) {
      return;
    }

    const walletMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.wallet,
    });
    if (walletMatch) {
      return;
    }

    const verifyEmailMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.verify,
    });
    if (verifyEmailMatch) {
      return;
    }

    const profileMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.profile,
      exact: true,
    });
    if (profileMatch) {
      return;
    }

    const seedBackupMatch = yield matchPath(payload.location.pathname, {
      path: profileRoutes.seedBackup,
      exact: true,
    });
    if (seedBackupMatch) {
      return;
    }

    const kycMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.kyc,
    });
    if (kycMatch) {
      return;
    }

    yield neuCall(fallbackRedirect, payload.location);
  } catch (e) {
    logger.error("error in issuerRouting saga", e);
    yield neuCall(fallbackRedirect, payload.location);
  }
}
