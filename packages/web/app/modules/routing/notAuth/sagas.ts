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

export function* notAuthorizedRouting(
  { logger }: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  try {
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
      return yield put(actions.etoView.loadNotAuthorizedEtoView(GREYP_PREVIEW_CODE, greypMatch));
    }
    /* ----------------------------------------- */

    const etoViewMatch = yield matchPath<TEtoViewByPreviewCodeMatch>(payload.location.pathname, {
      path: appRoutes.etoPublicView,
    });
    if (etoViewMatch !== null) {
      const previewCode = yield etoViewMatch.params.previewCode;
      return yield put(actions.etoView.loadNotAuthorizedEtoView(previewCode, etoViewMatch));
    }

    const etoViewByIdMatch = yield matchPath<TEtoViewByIdMatch>(payload.location.pathname, {
      path: appRoutes.etoPublicViewById,
    });
    if (etoViewByIdMatch !== null) {
      const etoId = yield etoViewByIdMatch.params.etoId;
      return yield put(actions.etoView.loadNotAuthorizedEtoViewById(etoId, etoViewByIdMatch));
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

    const rootMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.root,
    });
    if (rootMatch !== null) {
      return;
    }

    const registerMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.register,
    });
    if (registerMatch !== null) {
      return;
    }

    const loginMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.login,
    });
    if (loginMatch !== null) {
      return;
    }

    const restoreMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.restore,
    });
    if (restoreMatch !== null) {
      return;
    }

    if (process.env.NF_ISSUERS_ENABLED === "1") {
      const etoLandingMatch = yield matchPath(payload.location.pathname, {
        path: appRoutes.etoLanding,
      });
      if (etoLandingMatch !== null) {
        return;
      }

      const registerIssuerMatch = yield matchPath(payload.location.pathname, {
        path: appRoutes.registerIssuer,
      });
      if (registerIssuerMatch !== null) {
        return;
      }

      const loginIssuerMatch = yield matchPath(payload.location.pathname, {
        path: appRoutes.loginIssuer,
      });
      if (loginIssuerMatch !== null) {
        return;
      }

      const restoreIssuerMatch = yield matchPath(payload.location.pathname, {
        path: appRoutes.restoreIssuer,
      });
      if (restoreIssuerMatch !== null) {
        return;
      }
    }

    if (process.env.NF_NOMINEE_ENABLED === "1") {
      const registerNomineeMatch = yield matchPath(payload.location.pathname, {
        path: appRoutes.registerNominee,
      });
      if (registerNomineeMatch !== null) {
        return;
      }

      const loginNomineeMatch = yield matchPath(payload.location.pathname, {
        path: appRoutes.loginNominee,
      });
      if (loginNomineeMatch !== null) {
        return;
      }

      const restoreNomineeMatch = yield matchPath(payload.location.pathname, {
        path: appRoutes.restoreNominee,
      });
      if (restoreNomineeMatch !== null) {
        return;
      }
    }

    // TODO unskip this when all routes are in sagas
    // yield neuCall(fallbackRedirect, payload.location)
  } catch (e) {
    logger.error("error in notAuthorizedRouting saga", e);
    yield neuCall(fallbackRedirect, payload.location);
  }
}
