import * as React from "react";

import { TIssuerEtoViewData } from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewTabsLayout } from "../../shared/campaign-overview/CampaignOverviewTabsLayout";
import { CampaignOverviewIssuerLayout } from "./CampaignOverviewIssuerLayout";

export const CampaignOverviewWithStatsIssuerLayout: React.FunctionComponent<TIssuerEtoViewData> = ({
  campaignOverviewData,
  eto,
}) =>
  campaignOverviewData.url && campaignOverviewData.path ? (
    <CampaignOverviewTabsLayout
      etoId={eto.etoId}
      url={campaignOverviewData.url}
      path={campaignOverviewData.path}
    >
      <CampaignOverviewIssuerLayout campaignOverviewData={campaignOverviewData} eto={eto} />
    </CampaignOverviewTabsLayout>
  ) : null;
