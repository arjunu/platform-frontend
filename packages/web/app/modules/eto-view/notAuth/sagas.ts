import { TGlobalDependencies } from "../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../actions";
import { TEtoWithCompanyAndContractReadonly } from "../../eto/types";
import { neuCall, neuTakeEvery } from "../../sagasUtils";
import { loadEtoWithCompanyAndContract, loadEtoWithCompanyAndContractById } from "../../eto/sagas";
import { EEtoViewCampaignOverviewType, EEtoViewType, TCampaignOverviewData } from "../reducer";
import { call, fork, put } from "redux-saga/effects";
import { createMessage } from "../../../components/translatedMessages/utils";
import { EtoMessage } from "../../../components/translatedMessages/messages";
import {  calculateEtoViewCampaignOverviewType} from "../sagas";

export function* loadNotAuthorizedEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>
) {
  console.log("----loadNotAuthorizedEtoView")
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(loadEtoWithCompanyAndContract, payload.previewCode);

    //fixme extract this to a sep. saga
    let campaignOverviewData: TCampaignOverviewData;

    const campaignOverviewType:EEtoViewCampaignOverviewType = yield call(calculateEtoViewCampaignOverviewType, eto);

    if(campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS){
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

    yield put(actions.etoView.setEtoViewData({ eto, campaignOverviewData, etoViewType:EEtoViewType.ETO_VIEW_NOT_AUTHORIZED }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* loadNotAuthorizedEtoViewById(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadNotAuthorizedEtoViewById>
) {
  console.log("----loadNotAuthorizedEtoViewById")
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(loadEtoWithCompanyAndContractById, payload.etoId);

    //fixme extract this to a sep. saga
    let campaignOverviewData: TCampaignOverviewData;

    const campaignOverviewType:EEtoViewCampaignOverviewType = yield call(calculateEtoViewCampaignOverviewType, eto);

    if(campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS){
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

    yield put(actions.etoView.setEtoViewData({ eto, campaignOverviewData, etoViewType:EEtoViewType.ETO_VIEW_NOT_AUTHORIZED }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

export function* etoViewNotAuthSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadNotAuthorizedEtoView, loadNotAuthorizedEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadNotAuthorizedEtoViewById, loadNotAuthorizedEtoViewById);
}
