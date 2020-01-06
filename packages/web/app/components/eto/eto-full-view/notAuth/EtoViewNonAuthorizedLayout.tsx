import * as React from "react";

import { TEtoViewData } from "../../../../modules/eto-view/shared/types";
import { CoverBanner } from "../shared/cover-banner/CoverBanner";
import { EtoViewLayout } from "../shared/EtoViewLayout";

const EtoViewNonAuthorizedLayout: React.FunctionComponent<TEtoViewData> = ({
  eto,
  userIsFullyVerified,
  campaignOverviewData,
}) =>
  <EtoViewLayout
    eto={eto}
    userIsFullyVerified={userIsFullyVerified}
    campaignOverviewData={campaignOverviewData}
  >
    <CoverBanner jurisdiction={eto.product.jurisdiction} />
  </EtoViewLayout>;
export { EtoViewNonAuthorizedLayout };
