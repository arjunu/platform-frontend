import { branch, compose, renderComponent } from "recompose";

import { TEtoWithCompanyAndContractReadonly } from "../../../../modules/eto/types";
import { EtoViewCampaignOverviewWithStatsLayout } from "./EtoViewCampaignOverviewWithStatsLayout";
import { EtoViewCampaignOverviewLayout } from "./EtoViewCampaignOverviewLayout";
import {
  EEtoViewCampaignOverviewType,
  TCampaignOverviewData,
  TCampaignOverviewWithStatsData
} from "../../../../modules/eto-view/reducer";


export type TEtoViewCampaignOverviewProps = {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
  isUserFullyVerified: boolean;
}

export const EtoViewCampaignOverview = compose<TEtoViewCampaignOverviewProps,TEtoViewCampaignOverviewProps & {data:TCampaignOverviewData}>(
  branch<TEtoViewCampaignOverviewProps & {data:TCampaignOverviewData}>(
    ({data}) => data.campaignOverviewType === EEtoViewCampaignOverviewType.WITH_STATS,
    renderComponent<TEtoViewCampaignOverviewProps & {data:TCampaignOverviewWithStatsData}>(EtoViewCampaignOverviewWithStatsLayout),
  ),
)(EtoViewCampaignOverviewLayout);
