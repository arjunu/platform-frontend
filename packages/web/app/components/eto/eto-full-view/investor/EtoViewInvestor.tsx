import { compose } from "recompose";

import { TInvestorEtoViewData } from "../../../../modules/eto-view/shared/types";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { withMetaTags } from "../../../../utils/withMetaTags.unsafe";
import { Layout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { withJurisdictionDisclaimer } from "../shared/jurisdiction-utils/withJurisdictionDisclaimer";
import { withJurisdictionRoute } from "../shared/jurisdiction-utils/withJurisdictionRoute";
import { EtoViewInvestorLayout } from "./EtoViewInvestorLayout";

export const EtoViewInvestor = compose<TInvestorEtoViewData, TInvestorEtoViewData>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withJurisdictionDisclaimer<TInvestorEtoViewData>(props => props.eto.previewCode),
  withJurisdictionRoute<TInvestorEtoViewData>(props => ({
    previewCode: props.eto.previewCode,
    jurisdiction: props.eto.product.jurisdiction,
  })),
  withMetaTags<TInvestorEtoViewData>(({ eto }) => ({
    title: `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`,
  })),
)(EtoViewInvestorLayout);
