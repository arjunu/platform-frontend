import { branch, compose, renderComponent } from "recompose";

import {
  EEtoViewCampaignOverviewType,
  TIssuerEtoViewData,
} from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewIssuerLayout } from "./CampaignOverviewIssuerLayout";
import { CampaignOverviewWithStatsIssuerLayout } from "./CampaignOverviewWithStatsIssuerLayout";

export const CampaignOverviewIssuer = compose<{}, TIssuerEtoViewData>(
  branch<TIssuerEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS,
    renderComponent<TIssuerEtoViewData>(CampaignOverviewWithStatsIssuerLayout),
  ),
  branch<TIssuerEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITHOUT_STATS,
    renderComponent<TIssuerEtoViewData>(CampaignOverviewIssuerLayout),
  ),
)(() => null);
