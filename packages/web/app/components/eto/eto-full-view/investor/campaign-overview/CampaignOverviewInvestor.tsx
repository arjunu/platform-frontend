import { branch, compose, renderComponent } from "recompose";

import {
  EEtoViewCampaignOverviewType,
  TInvestorEtoViewData,
} from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewInvestorLayout } from "./CampaignOverviewInvestorLayout";
import { CampaignOverviewWithStatsInvestorLayout } from "./CampaignOverviewWithStatsInvestorLayout";

export const CampaignOverviewInvestor = compose<{}, TInvestorEtoViewData>(
  branch<TInvestorEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS,
    renderComponent<TInvestorEtoViewData>(CampaignOverviewWithStatsInvestorLayout),
  ),
  branch<TInvestorEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITHOUT_STATS,
    renderComponent<TInvestorEtoViewData>(CampaignOverviewInvestorLayout),
  ),
)(() => null);
