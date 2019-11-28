import { put } from "redux-saga/effects";
import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { appRoutes, TEtoViewByIdMatch, TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";
import { actions } from "../../actions";
import { GREYP_PREVIEW_CODE } from "../sagas";

export function* investorRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
) {
  const greypMatch = yield matchPath<any>(payload.location.pathname, {path: appRoutes.greypWithJurisdiction})
  if(greypMatch !== null){
    yield put(actions.etoView.loadInvestorEtoView(GREYP_PREVIEW_CODE, greypMatch))
  }

  const etoViewInvestorMatch = yield matchPath<TEtoViewByPreviewCodeMatch>(payload.location.pathname, { path: appRoutes.etoPublicView });
  const etoViewByIdInvestorMatch = yield matchPath<TEtoViewByIdMatch>(payload.location.pathname, { path: appRoutes.etoPublicViewById });

  if (etoViewByIdInvestorMatch !== null) {
    const previewCode = etoViewByIdInvestorMatch.params.previewCode;
    yield put(actions.etoView.loadInvestorEtoViewById(previewCode, etoViewByIdInvestorMatch))
  }
  if (etoViewInvestorMatch !== null) {
    const previewCode = etoViewInvestorMatch.params.previewCode;
    yield put(actions.etoView.loadInvestorEtoView(previewCode, etoViewInvestorMatch))
  }
}
