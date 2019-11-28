import { createActionFactory } from "@neufund/shared";
import { TReadyEtoViewData } from "./reducer";
import { EtoViewNomineeActions } from "./nominee/actions";
import { EtoViewIssuerActions } from "./issuer/actions";
import { etoViewInvestorActions } from "./investor/actions";
import { etoViewNotAuthActions } from "./notAuth/actions";


export const etoViewActions = {
  setEtoViewData: createActionFactory(
    "ETO_VIEW_SET_ETO_DATA",
    (etoData: TReadyEtoViewData) => ({ etoData })
  ),
  setEtoError: createActionFactory(
    "ETO_VIEW_SET_ETO_ERROR",
  ),
  ...etoViewNotAuthActions,
  ...etoViewInvestorActions,
  ...EtoViewIssuerActions,
  ...EtoViewNomineeActions,
};
