import { call, fork, put } from "redux-saga/effects";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { calculateCampaignOverviewData } from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData } from "../shared/types";

export function* loadNotAuthorizedEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Iterator<any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      payload.previewCode,
    );

    const campaignOverviewData: TCampaignOverviewData = yield call(
      calculateCampaignOverviewData,
      payload.routeMatch,
      eto,
    );

    yield put(
      actions.etoView.setEtoViewData({
        eto,
        campaignOverviewData,
        etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED,
      }),
    );
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

    const campaignOverviewData: TCampaignOverviewData = yield call(
      calculateCampaignOverviewData,
      payload.routeMatch,
      eto,
    );

    yield put(
      actions.etoView.setEtoViewData({
        eto,
        campaignOverviewData,
        etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED,
      }),
    );
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
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
