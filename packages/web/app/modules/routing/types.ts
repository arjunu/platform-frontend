import { ELogoutReason } from "../auth/types";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";

export type TLoginRouterState = { logoutReason: ELogoutReason } | undefined;
export type TEtoViewByPreviewCodeMatch = { jurisdiction: EJurisdiction; previewCode: string };
export type TEtoViewByIdMatch = { jurisdiction: EJurisdiction; etoId: string };
export type TEtoIssuerPreviewMatch = { previewCode: string };
export type TEtoPublicViewLegacyRouteMatch = { preveiwCode: string };
export type TEtoPublicViewByIdLegacyRoute = { etoId: string };
