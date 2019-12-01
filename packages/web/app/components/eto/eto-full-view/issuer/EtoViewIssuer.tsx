import { compose } from "recompose";

import { TIssuerEtoViewData } from "../../../../modules/eto-view/shared/types";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { withMetaTags } from "../../../../utils/withMetaTags.unsafe";
import { Layout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { EtoViewIssuerLayout } from "./EtoViewIssuerLayout";

export const EtoViewIssuer = compose<TIssuerEtoViewData, TIssuerEtoViewData>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withMetaTags<TIssuerEtoViewData>(({ eto }, intl) => {
    const requiredDataPresent =
      eto.company.brandName && eto.equityTokenName && eto.equityTokenSymbol;

    return {
      title: requiredDataPresent
        ? `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
        : intl.formatIntlMessage("menu.eto-page"),
    };
  }),
)(EtoViewIssuerLayout);
