import { match } from "react-router";
import { call, select } from "redux-saga/effects";

import { appRoutes, TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";
import { ETHEREUM_ZERO_ADDRESS } from "../../../config/constants";
import { EUserType } from "../../../lib/api/users/interfaces";
import { selectUserType } from "../../auth/selectors";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContractReadonly,
} from "../../eto/types";
import { etoViewInvestorSagas } from "../investor/sagas";
import { etoViewIssuerSagas } from "../issuer/sagas";
import { etoViewNomineeSagas } from "../nominee/sagas";
import { etoViewNotAuthSagas } from "../notAuth/sagas";
import { EEtoViewCampaignOverviewType } from "./types";
import { getTwitterData } from "./utils";

export function* calculateEtoViewCampaignOverviewType(
  eto: TEtoWithCompanyAndContractReadonly,
): Iterator<any> {
  const userType = yield select(selectUserType);
  const timedState = eto.contract && eto.contract.timedState;
  const subState = eto.subState;

  if (timedState) {
    if (userType === EUserType.ISSUER && timedState === EETOStateOnChain.Whitelist) {
      return EEtoViewCampaignOverviewType.WITH_STATS;
    } else if (
      timedState === EETOStateOnChain.Whitelist &&
      subState !== EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE
    ) {
      return EEtoViewCampaignOverviewType.WITH_STATS;
    } else if (timedState >= 2) {
      //from public onwards
      return EEtoViewCampaignOverviewType.WITH_STATS;
    }
  }

  return EEtoViewCampaignOverviewType.WITHOUT_STATS;
}

export function* getCampaignOverviewData(eto: TEtoWithCompanyAndContractReadonly): Iterator<any> {
  const twitterData = getTwitterData(eto.company);

  return {
    showYouTube: !!(eto.company.companyVideo && eto.company.companyVideo.url),
    showSlideshare: !!(eto.company.companySlideshare && eto.company.companySlideshare.url),
    showSocialChannels: !!(eto.company.socialChannels && eto.company.socialChannels.length),
    showInvestmentTerms: eto.product.id !== ETHEREUM_ZERO_ADDRESS,
    ...twitterData,
  };
}

export function* calculateCampaignOverviewDataIssuerNominee(
  eto: TEtoWithCompanyAndContractReadonly,
): Iterator<any> {
  const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(
    calculateEtoViewCampaignOverviewType,
    eto,
  );
  const campaignOverviewCommonData = yield call(getCampaignOverviewData, eto);

  if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
    return {
      campaignOverviewType,
      ...campaignOverviewCommonData,
      url: appRoutes.etoIssuerView,
      path: appRoutes.etoIssuerView,
    };
  } else {
    return {
      campaignOverviewType,
      ...campaignOverviewCommonData,
      url: appRoutes.etoIssuerView,
    };
  }
}

export function* calculateCampaignOverviewData(
  routeMatch: match<TEtoViewByPreviewCodeMatch | {}>,
  eto: TEtoWithCompanyAndContractReadonly,
): Iterator<any> {
  const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(
    calculateEtoViewCampaignOverviewType,
    eto,
  );

  const campaignOverviewCommonData = yield call(getCampaignOverviewData, eto);

  if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
    return {
      campaignOverviewType,
      ...campaignOverviewCommonData,
      url: routeMatch.url,
      path: routeMatch.path,
    };
  } else {
    return {
      campaignOverviewType,
      ...campaignOverviewCommonData,
      url: routeMatch.url,
    };
  }
}

export function* etoViewSagas(): any {
  yield* etoViewNotAuthSagas();
  yield* etoViewIssuerSagas();
  yield* etoViewInvestorSagas();
  yield* etoViewNomineeSagas();
}
