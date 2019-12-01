import { createActionFactory } from "@neufund/shared";

import { etoViewInvestorActions } from "../investor/actions";
import { EtoViewIssuerActions } from "../issuer/actions";
import { EtoViewNomineeActions } from "../nominee/actions";
import { etoViewNotAuthActions } from "../notAuth/actions";
import { TReadyEtoViewData } from "./types";

export const etoViewActions = {
  setEtoViewData: createActionFactory("ETO_VIEW_SET_ETO_DATA", (etoData: TReadyEtoViewData) => ({
    etoData,
  })),
  setEtoError: createActionFactory("ETO_VIEW_SET_ETO_ERROR"),
  ...etoViewNotAuthActions,
  ...etoViewInvestorActions,
  ...EtoViewIssuerActions,
  ...EtoViewNomineeActions,
};
