import { call, fork, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { selectIsUserVerifiedOnBlockchain } from "../../kyc/selectors";
import { EEtoViewCampaignOverviewType, EEtoViewType, TCampaignOverviewData } from "../reducer";
import { createMessage } from "../../../components/translatedMessages/utils";
import { EtoMessage } from "../../../components/translatedMessages/messages";
import { calculateEtoViewCampaignOverviewType } from "../sagas";

export function* loadInvestorEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>
) {
  console.log("----loadInvestorEtoView")
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(loadEtoWithCompanyAndContract, payload.previewCode);
    const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);

    console.log("----loadInvestorEtoView eto")
    //fixme extract this to a sep. saga
    let campaignOverviewData: TCampaignOverviewData;

    const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(calculateEtoViewCampaignOverviewType, eto);

    if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
      campaignOverviewData = {
        campaignOverviewType,
        url: payload.match.url,
        path: payload.match.path
      }
    } else {
      campaignOverviewData = {
        campaignOverviewType,
      }
    }
    console.log("---loadInvestorEtoView done")
    yield put(actions.etoView.setEtoViewData({
      eto,
      userIsFullyVerified,
      campaignOverviewData,
      etoViewType: EEtoViewType.ETO_VIEW_INVESTOR
    }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadInvestorEtoViewById(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoViewById>
) {
  console.log("----loadInvestorEtoViewById")
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(loadEtoWithCompanyAndContractById, payload.etoId);

    //fixme extract this to a sep. saga
    let campaignOverviewData: TCampaignOverviewData;

    const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(calculateEtoViewCampaignOverviewType, eto);

    if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
      campaignOverviewData = {
        campaignOverviewType,
        url: payload.match.url,
        path: payload.match.path
      }
    } else {
      campaignOverviewData = {
        campaignOverviewType,
      }
    }

    yield put(actions.etoView.setEtoViewData({
      eto,
      campaignOverviewData,
      etoViewType: EEtoViewType.ETO_VIEW_NOT_AUTHORIZED
    }));
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
