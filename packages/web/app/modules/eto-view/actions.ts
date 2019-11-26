import { createActionFactory } from "@neufund/shared";
import { TInvestorEtoViewData } from "./reducer";

export const etoViewActions = {
  loadInvestorEtoView: createActionFactory(
    "ETO_VIEW_LOAD_INVESTOR_ETO_VIEW",
    (previewCode:string) => ({previewCode})
  ),
  loadNotAuthorizedEtoView: createActionFactory(
    "ETO_VIEW_LOAD_NOT_AUTH_ETO_VIEW",
    (previewCode:string) => ({previewCode})
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
    (etoData: TInvestorEtoViewData) => ({etoData})
  ),
  setEtoError: createActionFactory(
    "ETO_VIEW_SET_ETO_ERROR",
  )

};
