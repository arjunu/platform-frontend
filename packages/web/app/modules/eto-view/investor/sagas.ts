import { call, fork, put, select } from "redux-saga/effects";

import { EtoMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { selectIsUserVerifiedOnBlockchain } from "../../kyc/selectors";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { calculateCampaignOverviewData } from "../shared/sagas";
import { EEtoViewType, TCampaignOverviewData } from "../shared/types";

export function* loadInvestorEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>,
): Iterator<any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContract,
      payload.previewCode,
    );
    const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);

    const campaignOverviewData: TCampaignOverviewData = yield call(
      calculateCampaignOverviewData,
      payload.routeMatch,
      eto,
    );

    yield put(
      actions.etoView.setEtoViewData({
        eto,
        userIsFullyVerified,
        campaignOverviewData,
        etoViewType: EEtoViewType.ETO_VIEW_INVESTOR,
      }),
    );
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadInvestorEtoViewById(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoViewById>,
): Iterator<any> {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(
      loadEtoWithCompanyAndContractById,
      payload.etoId,
    );
    const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);

    const campaignOverviewData: TCampaignOverviewData = yield call(
      calculateCampaignOverviewData,
      payload.routeMatch,
      eto,
    );

    yield put(
      actions.etoView.setEtoViewData({
        eto,
        userIsFullyVerified,
        campaignOverviewData,
        etoViewType: EEtoViewType.ETO_VIEW_INVESTOR,
      }),
    );
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewInvestorSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoView, loadInvestorEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoViewById, loadInvestorEtoViewById);
}
