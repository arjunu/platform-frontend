import { LocationChangeAction } from "connected-react-router";
import { put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { appRoutes } from "../../../components/appRoutes";
import { actions } from "../../actions";

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
