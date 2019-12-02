import { compose } from "recompose";

import { TInvestorEtoViewData } from "../../../../modules/eto-view/shared/types";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { withMetaTags } from "../../../../utils/withMetaTags.unsafe";
import { Layout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { EtoViewInvestorLayout } from "./EtoViewInvestorLayout";

export const EtoViewInvestor = compose<TInvestorEtoViewData, TInvestorEtoViewData>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withMetaTags<TInvestorEtoViewData>(({ eto }) => ({
    title: `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`,
  })),
)(EtoViewInvestorLayout);
