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
import { GREYP_PREVIEW_CODE } from "../sagas";

export function* investorRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
): Iterator<any> {
  const greypMatch = yield matchPath<any>(payload.location.pathname, {
    path: appRoutes.greypWithJurisdiction,
  });
  console.log("greypMatch",greypMatch)
  if (greypMatch !== null) {
    yield put(actions.etoView.loadInvestorEtoView(GREYP_PREVIEW_CODE, greypMatch));
  }

  const etoViewByIdInvestorMatch = yield matchPath<TEtoViewByIdMatch>(payload.location.pathname, {
    path: appRoutes.etoPublicViewById,
  });
  console.log("etoViewByIdInvestorMatch",etoViewByIdInvestorMatch)
  if (etoViewByIdInvestorMatch !== null) {
    const etoId = etoViewByIdInvestorMatch.params.etoId;
    yield put(actions.etoView.loadInvestorEtoViewById(etoId, etoViewByIdInvestorMatch));
  }

  const etoViewInvestorMatch = yield matchPath<TEtoViewByPreviewCodeMatch>(
    payload.location.pathname,
    { path: appRoutes.etoPublicView },
  );
  console.log("etoViewInvestorMatch",etoViewInvestorMatch)
  if (etoViewInvestorMatch !== null) {
    const previewCode = etoViewInvestorMatch.params.previewCode;
    yield put(actions.etoView.loadInvestorEtoView(previewCode, etoViewInvestorMatch));
  }
}
