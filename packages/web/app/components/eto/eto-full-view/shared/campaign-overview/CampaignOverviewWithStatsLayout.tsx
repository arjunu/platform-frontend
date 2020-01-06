import * as React from "react";

import { TEtoViewData } from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewTabsLayout } from "./CampaignOverviewTabsLayout";
import { CampaignOverviewLayout } from "./CampaignOverviewLayout";


export const CampaignOverviewWithStatsLayout: React.FunctionComponent<TEtoViewData> = ({
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
      <CampaignOverviewLayout
        campaignOverviewData={campaignOverviewData}
        userIsFullyVerified={userIsFullyVerified}
        eto={eto}
      />
    </CampaignOverviewTabsLayout>
  ) : null;
