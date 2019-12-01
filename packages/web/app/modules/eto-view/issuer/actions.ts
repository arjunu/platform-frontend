import { createActionFactory } from "@neufund/shared";
import { match } from "react-router";

import { TEtoIssuerPreviewMatch } from "../../../components/appRoutes";

export const EtoViewIssuerActions = {
  loadIssuerEtoView: createActionFactory(
    "ETO_VIEW_LOAD_ISSUER_ETO_VIEW",
    (routeMatch: match<{}>) => ({ routeMatch }),
  ),
  loadIssuerPreviewEtoView: createActionFactory(
    "ETO_VIEW_LOAD_ISSUER_ETO_PREVIEW",
    (previewCode: string, routeMatch: match<TEtoIssuerPreviewMatch>) => ({
      previewCode,
      routeMatch,
    }),
  ),
};
