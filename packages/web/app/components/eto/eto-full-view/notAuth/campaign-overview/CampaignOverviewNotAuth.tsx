import { branch, compose, renderComponent } from "recompose";

import {
  EEtoViewCampaignOverviewType,
  TNotAuthorizedEtoViewData,
} from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewNotAuthLayout } from "./CampaignOverviewNotAuthLayout";
import { CampaignOverviewWithStatsNotAuthLayout } from "./CampaignOverviewWithStatsNotAuthLayout";

export const CampaignOverviewNotAuth = compose<{}, TNotAuthorizedEtoViewData>(
  branch<TNotAuthorizedEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS,
    renderComponent<TNotAuthorizedEtoViewData>(CampaignOverviewWithStatsNotAuthLayout),
  ),
  branch<TNotAuthorizedEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITHOUT_STATS,
    renderComponent<TNotAuthorizedEtoViewData>(CampaignOverviewNotAuthLayout),
  ),
)(() => null);
