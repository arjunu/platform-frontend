import { branch, compose, renderComponent } from "recompose";

import {
  EEtoViewCampaignOverviewType,
  TIssuerPreviewEtoViewData,
} from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewIssuerPreviewLayout } from "./CampaignOverviewIssuerPreviewLayout";
import { CampaignOverviewWithStatsIssuerPreviewLayout } from "./CampaignOverviewWithStatsIssuerPreviewLayout";

export const CampaignOverviewIssuerPreview = compose<{}, TIssuerPreviewEtoViewData>(
  branch<TIssuerPreviewEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS,
    renderComponent<TIssuerPreviewEtoViewData>(CampaignOverviewWithStatsIssuerPreviewLayout),
  ),
  branch<TIssuerPreviewEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITHOUT_STATS,
    renderComponent<TIssuerPreviewEtoViewData>(CampaignOverviewIssuerPreviewLayout),
  ),
)(() => null);
