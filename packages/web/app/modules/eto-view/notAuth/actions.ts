import { match } from "react-router";

import { createActionFactory } from "../../../../../shared/dist/modules/actionsUtils";
import { TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";

export const etoViewNotAuthActions = {
  loadNotAuthorizedEtoView: createActionFactory(
    "ETO_VIEW_LOAD_NOT_AUTH_ETO_VIEW",
    (previewCode: string, routeMatch: match<TEtoViewByPreviewCodeMatch>) => ({
      previewCode,
      match: routeMatch,
    }),
  ),
  loadNotAuthorizedEtoViewById: createActionFactory(
    "ETO_VIEW_LOAD_NOT_AUTH_ETO_VIEW_BY_ID",
    (etoId: string, routeMatch: match<TEtoViewByPreviewCodeMatch>) => ({ etoId, routeMatch }),
  ),
};
