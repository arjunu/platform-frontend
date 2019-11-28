import { LocationChangeAction } from "connected-react-router";
import { matchPath } from "react-router";
import { put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { appRoutes, TEtoViewByIdMatch, TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";
import { actions } from "../../actions";
import { GREYP_PREVIEW_CODE } from "../sagas";

export function* notAuthorizedRouting(
  _: TGlobalDependencies,
  { payload }: LocationChangeAction,
) {
  const greypMatch = yield matchPath<any>(payload.location.pathname, {path: appRoutes.greypWithJurisdiction})
  if(greypMatch !== null){
    yield put(actions.etoView.loadNotAuthorizedEtoView(GREYP_PREVIEW_CODE, greypMatch))
  }
  const etoViewNotAuthorizedMatch = yield matchPath<TEtoViewByPreviewCodeMatch>(payload.location.pathname, { path: appRoutes.etoPublicView });
  const etoViewByIdNotAuthorizedMatch = yield matchPath<TEtoViewByIdMatch>(payload.location.pathname, { path: appRoutes.etoPublicViewById });

  if (etoViewNotAuthorizedMatch !== null) {
    const previewCode = etoViewNotAuthorizedMatch.params.previewCode;
    yield put(actions.etoView.loadNotAuthorizedEtoView(previewCode, etoViewNotAuthorizedMatch))
  }
  if (etoViewByIdNotAuthorizedMatch !== null) {
    const etoId = etoViewNotAuthorizedMatch.params.etoId;
    yield put(actions.etoView.loadNotAuthorizedEtoViewById(etoId, etoViewNotAuthorizedMatch))
  }
}
