import { match } from "react-router";
import { call, fork, put } from "redux-saga/effects";

import { TEtoViewByIdMatch, TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";
import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { ensureEtoJurisdiction } from "../../routing/sagas";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { calculateCampaignOverviewData } from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData } from "../shared/types";

function* loadNotAuthorizedEtoViewInternal(
  eto: TEtoWithCompanyAndContractReadonly,
  routeMatch: match<TEtoViewByPreviewCodeMatch | TEtoViewByIdMatch>,
): Iterator<any> {
  yield call(ensureEtoJurisdiction, eto.product.jurisdiction, routeMatch.params.jurisdiction);

  yield put(actions.eto.verifyEtoAccess(eto, false));

  const campaignOverviewData: TCampaignOverviewData = yield call(
    calculateCampaignOverviewData,
    routeMatch,
    eto,
  );

  return {
    eto,
    campaignOverviewData,
    etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED,
  };
}

export function* loadNotAuthorizedEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Iterator<any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      payload.previewCode,
    );

    const etoData = yield call(loadNotAuthorizedEtoViewInternal, eto, payload.routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadNotAuthorizedEtoViewById(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadNotAuthorizedEtoViewById>,
): Iterator<any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContractById,
      payload.etoId,
    );

    const etoData = yield call(loadNotAuthorizedEtoViewInternal, eto, payload.routeMatch);
    yield put(actions.etoView.setEtoViewData(etoData));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewNotAuthSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadNotAuthorizedEtoView, loadNotAuthorizedEtoView);
  yield fork(
    neuTakeEvery,
    actions.etoView.loadNotAuthorizedEtoViewById,
    loadNotAuthorizedEtoViewById,
  );
}
