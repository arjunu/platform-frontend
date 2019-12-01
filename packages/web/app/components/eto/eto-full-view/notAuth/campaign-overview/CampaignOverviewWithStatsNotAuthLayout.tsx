import * as React from "react";

import { TNotAuthorizedEtoViewData } from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewTabsLayout } from "../../shared/campaign-overview/CampaignOverviewTabsLayout";
import { CampaignOverviewNotAuthLayout } from "./CampaignOverviewNotAuthLayout";

export const CampaignOverviewWithStatsNotAuthLayout: React.FunctionComponent<TNotAuthorizedEtoViewData> = ({
  campaignOverviewData,
  eto,
}) =>
  campaignOverviewData.url && campaignOverviewData.path ? (
    <CampaignOverviewTabsLayout
      etoId={eto.etoId}
      url={campaignOverviewData.url}
      path={campaignOverviewData.path}
    >
      <CampaignOverviewNotAuthLayout campaignOverviewData={campaignOverviewData} eto={eto} />
    </CampaignOverviewTabsLayout>
  ) : null;
