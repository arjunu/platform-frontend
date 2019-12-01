import { createActionFactory } from "@neufund/shared";
import { match } from "react-router";

export const EtoViewNomineeActions = {
  loadNomineeEtoView: createActionFactory(
    "ETO_VIEW_LOAD_NOMINEE_ETO_VIEW",
    (routeMatch: match<{}>) => ({ routeMatch }),
  ),
};
