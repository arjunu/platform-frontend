import * as React from "react";

import { TIssuerPreviewEtoViewData } from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewTabsLayout } from "../../shared/campaign-overview/CampaignOverviewTabsLayout";
import { CampaignOverviewIssuerLayout } from "./CampaignOverviewIssuerLayout";

export const CampaignOverviewWithStatsIssuerPreviewLayout: React.FunctionComponent<TIssuerPreviewEtoViewData> = ({
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
