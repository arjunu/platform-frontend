import { call, fork, put, select } from "redux-saga/effects";

import { neuCall, neuTakeEvery } from "../sagasUtils";
import { actions, TActionFromCreator } from "../actions";
import { loadEtoWithCompanyAndContract } from "../eto/sagas";
import { TGlobalDependencies } from "../../di/setupBindings";
import { createMessage } from "../../components/translatedMessages/utils";
import { EtoMessage } from "../../components/translatedMessages/messages";
import { selectIsUserVerifiedOnBlockchain } from "../kyc/selectors";
import { EETOStateOnChain, EEtoSubState, TEtoWithCompanyAndContractReadonly } from "../eto/types";
import { EUserType } from "../../lib/api/users/interfaces";
import { selectUserType } from "../auth/selectors";
import { EEtoViewCampaignOverviewType, EEtoViewType, TCampaignOverviewData } from "./reducer";
import { selectIssuerEtoWithCompanyAndContract } from "../eto-flow/selectors";
import { loadIssuerEto } from "../eto-flow/sagas";

export function* loadInvestorEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>
) {
  console.log("----loadInvestorEtoView")
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(loadEtoWithCompanyAndContract, payload.previewCode);
    const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);

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

    yield put(actions.etoView.setEtoViewData({ eto, userIsFullyVerified, campaignOverviewData, etoViewType:EEtoViewType.ETO_VIEW_INVESTOR }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
    yield put(actions.routing.goToDashboard());
  }
}

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

export function* loadIssuerEtoPreview(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>
) {
  console.log("----loadIssuerEtoPreview")
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

export function* loadIssuerEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
) {
  console.log("----loadIssuerEtoView");
  try {
    let eto = yield select(selectIssuerEtoWithCompanyAndContract);
    if(eto === undefined){
      yield neuCall(loadIssuerEto);
      eto = yield select(selectIssuerEtoWithCompanyAndContract);
    }

    yield put(actions.etoView.setEtoViewData({ eto, etoViewType:EEtoViewType.ETO_VIEW_ISSUER }));
  } catch (e) {
    logger.error("Could not load eto", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO));
    yield put(actions.routing.goToDashboard());
  }
}

//fixme move to utils
export function* calculateEtoViewCampaignOverviewType(eto:TEtoWithCompanyAndContractReadonly) {
  const userType = yield select(selectUserType);
  const timedState = eto.contract && eto.contract.timedState;
  const subState = eto.subState;

  if(timedState){
    if(userType === EUserType.ISSUER && timedState === EETOStateOnChain.Whitelist){
      return EEtoViewCampaignOverviewType.WITH_STATS
    } else if (timedState === EETOStateOnChain.Whitelist && subState !== EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE){
      return EEtoViewCampaignOverviewType.WITH_STATS
    } else if(timedState >= 2 ) { //from public onwards
      return EEtoViewCampaignOverviewType.WITH_STATS
    }
  } else {
    return EEtoViewCampaignOverviewType.WITHOUT_STATS
  }

}

export function* etoViewSagas(): any {
  yield fork(neuTakeEvery, actions.etoView.loadInvestorEtoView, loadInvestorEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadNotAuthorizedEtoView, loadNotAuthorizedEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadIssuerEtoView, loadIssuerEtoView);
  yield fork(neuTakeEvery, actions.etoView.loadIssuerPreviewEtoView, loadIssuerEtoPreview);
}
