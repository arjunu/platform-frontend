import { createActionFactory } from "@neufund/shared";
import { match } from "react-router";

import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { TEtoViewByIdMatch } from "../../routing/types";

export const etoViewInvestorActions = {
  loadInvestorEtoView: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW",
    (previewCode: string, routeMatch: match<{ jurisdiction: EJurisdiction }>) => ({
      previewCode,
      routeMatch,
    }),
  ),
  loadInvestorEtoViewById: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW_BY_ID",
    (etoId: string, routeMatch: match<TEtoViewByIdMatch>) => ({ etoId, routeMatch }),
  ),
};
