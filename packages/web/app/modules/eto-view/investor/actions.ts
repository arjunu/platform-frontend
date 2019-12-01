import { createActionFactory } from "@neufund/shared";
import { match } from "react-router";

import { TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";

export const etoViewInvestorActions = {
  loadInvestorEtoView: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW",
    (previewCode: string, routeMatch: match<TEtoViewByPreviewCodeMatch>) => ({
      previewCode,
      routeMatch,
    }),
  ),
  loadInvestorEtoViewById: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW_BY_ID",
    (etoId: string, routeMatch: match<TEtoViewByPreviewCodeMatch>) => ({ etoId, routeMatch }),
  ),
};
