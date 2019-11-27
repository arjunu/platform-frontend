import { createActionFactory } from "@neufund/shared";
import { TReadyEtoViewData } from "./reducer";
import { match } from "react-router";
import { TEtoViewByPreviewCodeMatch } from "../../components/appRoutes";

export const etoViewActions = {
  loadInvestorEtoView: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW",
    (previewCode:string, match: match<TEtoViewByPreviewCodeMatch>) => ({previewCode,match})
  ),
  loadNotAuthorizedEtoView: createActionFactory(
    "ETO_VIEW_LOAD_NOT_AUTH_ETO_VIEW",
    (previewCode:string,match: match<TEtoViewByPreviewCodeMatch>) => ({previewCode,match})
  ),
  loadIssuerEtoView: createActionFactory(
    "ETO_VIEW_LOAD_ISSUER_ETO_VIEW",
    (previewCode:string) => ({previewCode})
  ),
  // loadNomineeEtoView: createActionFactory(
  //   "ETO_VIEW_LOAD_NOMINEE_ETO_VIEW",
  //   (previewCode:string) => ({previewCode})
  // ),
  setEtoViewData: createActionFactory(
    "ETO_VIEW_SET_ETO_DATA",
    (etoData: TReadyEtoViewData) => ({etoData})
  ),
  setEtoError: createActionFactory(
    "ETO_VIEW_SET_ETO_ERROR",
  )

};
