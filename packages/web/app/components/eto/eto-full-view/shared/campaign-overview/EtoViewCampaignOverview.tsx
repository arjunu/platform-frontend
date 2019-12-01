import { branch, compose, renderComponent } from "recompose";

import {
  EEtoViewCampaignOverviewType,
  TCampaignOverviewData,
  TCampaignOverviewParams,
  TCampaignOverviewWithStatsData,
} from "../../../../../modules/eto-view/shared/types";
import { TEtoWithCompanyAndContractReadonly } from "../../../../../modules/eto/types";
import { EtoViewCampaignOverviewLayout } from "./EtoViewCampaignOverviewLayout";
import { EtoViewCampaignOverviewWithStatsLayout } from "./EtoViewCampaignOverviewWithStatsLayout";

export type TEtoViewCampaignOverviewProps = {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
  isUserFullyVerified: boolean;
  data: TCampaignOverviewParams;
};

export const EtoViewCampaignOverview = compose<
  {},
  TEtoViewCampaignOverviewProps & { data: TCampaignOverviewData }
>(
  branch<TEtoViewCampaignOverviewProps & { data: TCampaignOverviewData }>(
    ({ data }) => data.campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS,
    renderComponent<TEtoViewCampaignOverviewProps & { tabsData: TCampaignOverviewWithStatsData }>(
      EtoViewCampaignOverviewWithStatsLayout,
    ),
  ),
  branch<TEtoViewCampaignOverviewProps & { data: TCampaignOverviewData }>(
    ({ data }) => data.campaignOverviewType === EEtoViewCampaignOverviewType.WITHOUT_STATS,
    renderComponent<TEtoViewCampaignOverviewProps>(EtoViewCampaignOverviewLayout),
  ),
)(() => null);
