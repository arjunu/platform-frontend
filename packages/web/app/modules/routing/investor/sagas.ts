import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import {
  appRoutes,
  TEtoViewByIdMatch,
  TEtoViewByPreviewCodeMatch,
} from "../../../components/appRoutes";
import { profileRoutes } from "../../../components/settings/routes";
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

    if (process.env.NF_PORTFOLIO_PAGE_VISIBLE === "1") {
      const portfolioMatch = yield matchPath(payload.location.pathname, {
        path: appRoutes.portfolio,
      });
      if (portfolioMatch) {
        return;
      }
    }

    const icbmMigrationMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.icbmMigration,
    });
    if (icbmMigrationMatch) {
      return;
    }

    const walletUnlockMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.walletUnlock,
    });
    if (walletUnlockMatch) {
      return;
    }

    const walletMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.wallet,
    });
    if (walletMatch) {
      return;
    }

    const dashboardMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.dashboard,
      exact: true,
    });
    if (dashboardMatch) {
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
    logger.error("error in investorRouting saga", e);
    yield neuCall(fallbackRedirect, payload.location);
  }
}
