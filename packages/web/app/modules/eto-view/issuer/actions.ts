import { match } from "react-router";

import { createActionFactory } from "@neufund/shared";
import { TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";

export const EtoViewIssuerActions = {
  loadIssuerEtoView: createActionFactory(
    "ETO_VIEW_LOAD_ISSUER_ETO_VIEW",
  ),
  loadIssuerPreviewEtoView: createActionFactory(
    "ETO_VIEW_LOAD_ISSUER_ETO_PREVIEW",
    (previewCode: string, match: match<TEtoViewByPreviewCodeMatch>) => ({ previewCode, match })
  ),
}
