import * as React from "react";

import { TNomineeEtoViewData } from "../../../../../modules/eto-view/shared/types";
import { CampaignOverviewTabsLayout } from "../../shared/campaign-overview/CampaignOverviewTabsLayout";
import { CampaignOverviewNomineeLayout } from "./CampaignOverviewNomineeLayout";

export const CampaignOverviewWithStatsNomineeLayout: React.FunctionComponent<TNomineeEtoViewData> = ({
  campaignOverviewData,
  eto,
}) =>
  campaignOverviewData.url && campaignOverviewData.path ? (
    <CampaignOverviewTabsLayout
      etoId={eto.etoId}
      url={campaignOverviewData.url}
      path={campaignOverviewData.path}
    >
      <CampaignOverviewNomineeLayout campaignOverviewData={campaignOverviewData} eto={eto} />
    </CampaignOverviewTabsLayout>
  ) : null;
