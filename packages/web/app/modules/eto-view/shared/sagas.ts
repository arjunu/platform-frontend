import { match } from "react-router";
import { call, select } from "redux-saga/effects";

import { TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";
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
  } else {
    return EEtoViewCampaignOverviewType.WITHOUT_STATS;
  }
}

export function* calculateCampaignOverviewData(
  routeMatch: match<TEtoViewByPreviewCodeMatch>,
  eto: TEtoWithCompanyAndContractReadonly,
): Iterator<any> {
  const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(
    calculateEtoViewCampaignOverviewType,
    eto,
  );

  const showYouTube = !!(eto.company.companyVideo && eto.company.companyVideo.url);
  const showSlideshare = !!(eto.company.companySlideshare && eto.company.companySlideshare.url);
  const showSocialChannels = !!(eto.company.socialChannels && eto.company.socialChannels.length);
  const showInvestmentTerms = eto.product.id !== ETHEREUM_ZERO_ADDRESS;

  const twitterData = getTwitterData(eto.company);

  if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
    return {
      campaignOverviewType,
      url: routeMatch.url,
      path: routeMatch.path,
      showYouTube,
      showSlideshare,
      showSocialChannels,
      showInvestmentTerms,
      ...twitterData,
    };
  } else {
    return {
      campaignOverviewType,
      showYouTube,
      showSlideshare,
      showSocialChannels,
      showInvestmentTerms,
      ...twitterData,
    };
  }
}

export function* calculateCampaignOverviewDataIssuer( //fixme code duplication!!!
  eto: TEtoWithCompanyAndContractReadonly,
): Iterator<any> {
  const campaignOverviewType: EEtoViewCampaignOverviewType = yield call(
    calculateEtoViewCampaignOverviewType,
    eto,
  );

  const showYouTube = !!(eto.company.companyVideo && eto.company.companyVideo.url);
  const showSlideshare = !!(eto.company.companySlideshare && eto.company.companySlideshare.url);
  const showSocialChannels = !!(eto.company.socialChannels && eto.company.socialChannels.length);
  const showInvestmentTerms = eto.product.id !== ETHEREUM_ZERO_ADDRESS;
  const twitterData = getTwitterData(eto.company);

  if (campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS) {
    return {
      campaignOverviewType,
      url: "",
      path: "",
      showYouTube,
      showSlideshare,
      showSocialChannels,
      showInvestmentTerms,
      ...twitterData,
    };
  } else {
    return {
      campaignOverviewType,
      showYouTube,
      showSlideshare,
      showSocialChannels,
      showInvestmentTerms,
      ...twitterData,
    };
  }
}

export function* etoViewSagas(): any {
  yield* etoViewNotAuthSagas();
  yield* etoViewIssuerSagas();
  yield* etoViewInvestorSagas();
  yield* etoViewNomineeSagas();
}
