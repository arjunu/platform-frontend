import { match } from "react-router";

import { createActionFactory } from "@neufund/shared";
import { TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";

export const etoViewInvestorActions = {
  loadInvestorEtoView: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW",
    (previewCode:string, match: match<TEtoViewByPreviewCodeMatch>) => ({previewCode,match})
  ),
  loadInvestorEtoViewById: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW_BY_ID",
    (etoId:string,match: match<TEtoViewByPreviewCodeMatch>) => ({etoId,match})
  ),

}
