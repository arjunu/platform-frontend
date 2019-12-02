import { match } from "react-router";

import { createActionFactory } from "../../../../../shared/dist/modules/actionsUtils";
import { TEtoViewByIdMatch, TEtoViewByPreviewCodeMatch } from "../../../components/appRoutes";

export const etoViewNotAuthActions = {
  loadNotAuthorizedEtoView: createActionFactory(
    "ETO_VIEW_LOAD_NOT_AUTH_ETO_VIEW",
    (previewCode: string, routeMatch: match<TEtoViewByPreviewCodeMatch>) => ({
      previewCode,
      routeMatch,
    }),
  ),
  loadNotAuthorizedEtoViewById: createActionFactory(
    "ETO_VIEW_LOAD_NOT_AUTH_ETO_VIEW_BY_ID",
    (etoId: string, routeMatch: match<TEtoViewByIdMatch>) => ({ etoId, routeMatch }),
  ),
};
