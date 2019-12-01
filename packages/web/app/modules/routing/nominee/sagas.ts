import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import { appRoutes } from "../../../components/appRoutes";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions } from "../../actions";

export function* nomineeRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  if (payload.location.pathname === appRoutes.dashboard) {
    yield put(actions.nomineeFlow.nomineeDashboardView());
  }

  const etoViewNomineeMatch = yield matchPath(payload.location.pathname, {
    path: appRoutes.etoIssuerView,
  });
  if (etoViewNomineeMatch) {
    yield put(actions.etoView.loadNomineeEtoView(etoViewNomineeMatch));
  }

  if (payload.location.pathname === appRoutes.documents) {
    yield put(actions.nomineeFlow.nomineeDocumentsView());
  }
}
