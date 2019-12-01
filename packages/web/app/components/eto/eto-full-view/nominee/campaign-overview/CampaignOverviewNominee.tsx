import { branch, compose, renderComponent } from "recompose";

import {
  EEtoViewCampaignOverviewType,
  TNomineeEtoViewData,
} from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewNomineeLayout } from "./CampaignOverviewNomineeLayout";
import { CampaignOverviewWithStatsNomineeLayout } from "./CampaignOverviewWithStatsNomineeLayout";

export const CampaignOverviewNominee = compose<{}, TNomineeEtoViewData>(
  branch<TNomineeEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS,
    renderComponent<TNomineeEtoViewData>(CampaignOverviewWithStatsNomineeLayout),
  ),
  branch<TNomineeEtoViewData>(
    ({ campaignOverviewData }) =>
      campaignOverviewData.campaignOverviewType === EEtoViewCampaignOverviewType.WITHOUT_STATS,
    renderComponent<TNomineeEtoViewData>(CampaignOverviewNomineeLayout),
  ),
)(() => null);
