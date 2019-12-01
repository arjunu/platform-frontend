import * as React from "react";

import { TInvestorEtoViewData } from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewTabsLayout } from "../../shared/campaign-overview/CampaignOverviewTabsLayout";
import { CampaignOverviewInvestorLayout } from "./CampaignOverviewInvestorLayout";

export const CampaignOverviewWithStatsInvestorLayout: React.FunctionComponent<TInvestorEtoViewData> = ({
  campaignOverviewData,
  userIsFullyVerified,
  eto,
}) =>
  campaignOverviewData.url && campaignOverviewData.path ? (
    <CampaignOverviewTabsLayout
      etoId={eto.etoId}
      url={campaignOverviewData.url}
      path={campaignOverviewData.path}
    >
      <CampaignOverviewInvestorLayout
        campaignOverviewData={campaignOverviewData}
        userIsFullyVerified={userIsFullyVerified}
        eto={eto}
      />
    </CampaignOverviewTabsLayout>
  ) : null;
