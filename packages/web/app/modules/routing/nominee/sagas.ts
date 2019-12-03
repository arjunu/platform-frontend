import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import { appRoutes } from "../../../components/appRoutes";
import { profileRoutes } from "../../../components/settings/routes";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";
import { neuCall } from "../../sagasUtils";
import { fallbackRedirect, redirectLegacyEtoView } from "../sagas";

export function* nomineeRouting(
  { logger }: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  try {
    const dashboardMatch = yield matchPath<{}>(payload.location.pathname, {
      path: appRoutes.dashboard,
      exact: true,
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

    const documentsMatch = yield matchPath(payload.location.pathname, {
      path: appRoutes.documents,
    });
    if (documentsMatch) {
      return yield put(actions.nomineeFlow.nomineeDocumentsView());
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
    logger.error("error in nomineeRouting saga", e);
    yield neuCall(fallbackRedirect, payload.location);
  }
}
