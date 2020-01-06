import { branch, compose, renderComponent } from "recompose";

import {
  EEtoViewCampaignOverviewType,
  TEtoViewData,
} from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewWithStatsLayout } from "./CampaignOverviewWithStatsLayout";
import { CampaignOverviewLayout } from "./CampaignOverviewLayout";


export const CampaignOverview = compose<{}, TEtoViewData>(
  branch<TEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS,
    renderComponent<TEtoViewData>(CampaignOverviewWithStatsLayout),
  ),
  branch<TEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITHOUT_STATS,
    renderComponent<TEtoViewData>(CampaignOverviewLayout),
  ),
)(() => null);
