import * as React from "react";

import { TEtoViewData } from "../../../modules/eto-view/shared/types";
import { IssuerCoverBanner } from "./shared/cover-banner/IssuerCoverBanner";
import { EtoViewLayout } from "./shared/EtoViewLayout";
import { initEtoViewLayoutIssuer } from "./shared/initEtoViewLayoutIssuer";

const EtoViewIssuerLayout: React.FunctionComponent<TEtoViewData> = ({
  eto,
  userIsFullyVerified,
  campaignOverviewData,
}) => (
  <EtoViewLayout
    eto={eto}
    userIsFullyVerified={userIsFullyVerified}
    campaignOverviewData={campaignOverviewData}
    publicView={false}
  >
    <IssuerCoverBanner
      previewCode={eto.previewCode}
      jurisdiction={eto.product.jurisdiction}
      url={campaignOverviewData.url}
    />
  </EtoViewLayout>
);

const EtoViewIssuer = initEtoViewLayoutIssuer(EtoViewIssuerLayout);

export { EtoViewIssuerLayout, EtoViewIssuer };
