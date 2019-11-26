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

export enum EEtoViewCampaignOverviewType {
  WITH_STATS = "withStats",
  WITHOUT_STATS = "withoutStats"
}

export function* loadInvestorEtoView(
  { logger, notificationCenter }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.etoView.loadInvestorEtoView>
) {
  try {
    const eto: TEtoWithCompanyAndContractReadonly = yield neuCall(loadEtoWithCompanyAndContract, payload.previewCode);
    const userIsFullyVerified = yield select(selectIsUserVerifiedOnBlockchain);
    const campaignOverviewType = yield call(calculateEtoViewCampaignOverviewType, eto);

    yield put(actions.etoView.setEtoViewData({ eto, userIsFullyVerified, match: payload.match, campaignOverviewType }));
  } catch (e) {
    logger.error("Could not load eto by preview code", e);
    notificationCenter.error(createMessage(EtoMessage.COULD_NOT_LOAD_ETO_PREVIEW));
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
}
