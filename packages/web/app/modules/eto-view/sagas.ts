import { select } from "redux-saga/effects";

import { EETOStateOnChain, EEtoSubState, TEtoWithCompanyAndContractReadonly } from "../eto/types";
import { EUserType } from "../../lib/api/users/interfaces";
import { selectUserType } from "../auth/selectors";
import { EEtoViewCampaignOverviewType } from "./reducer";
import { etoViewNotAuthSagas } from "./notAuth/sagas";
import { etoViewIssuerSagas } from "./issuer/sagas";
import { etoViewInvestorSagas } from "./investor/sagas";
import { etoViewNomineeSagas } from "./nominee/sagas";

//fixme move to utils
export function* calculateEtoViewCampaignOverviewType(eto: TEtoWithCompanyAndContractReadonly) {
  const userType = yield select(selectUserType);
  const timedState = eto.contract && eto.contract.timedState;
  const subState = eto.subState;

  if (timedState) {
    if (userType === EUserType.ISSUER && timedState === EETOStateOnChain.Whitelist) {
      return EEtoViewCampaignOverviewType.WITH_STATS
    } else if (timedState === EETOStateOnChain.Whitelist && subState !== EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE) {
      return EEtoViewCampaignOverviewType.WITH_STATS
    } else if (timedState >= 2) { //from public onwards
      return EEtoViewCampaignOverviewType.WITH_STATS
    }
  } else {
    return EEtoViewCampaignOverviewType.WITHOUT_STATS
  }
}

export function* etoViewSagas(): any {
  yield* etoViewNotAuthSagas();
  yield* etoViewIssuerSagas();
  yield* etoViewInvestorSagas();
  yield* etoViewNomineeSagas();
}
