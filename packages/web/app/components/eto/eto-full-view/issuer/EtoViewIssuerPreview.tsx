import { compose } from "recompose";

import { TIssuerPreviewEtoViewData } from "../../../../modules/eto-view/shared/types";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { withMetaTags } from "../../../../utils/withMetaTags.unsafe";
import { Layout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { EtoViewIssuerPreviewLayout } from "./EtoViewIssuerPreviewLayout";

export const EtoViewIssuerPreview = compose<TIssuerPreviewEtoViewData, TIssuerPreviewEtoViewData>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withMetaTags<TIssuerPreviewEtoViewData>(({ eto }, intl) => {
    const requiredDataPresent =
      eto.company.brandName && eto.equityTokenName && eto.equityTokenSymbol;

    return {
      title: requiredDataPresent
        ? `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
        : intl.formatIntlMessage("menu.eto-page"),
    };
  }),
)(EtoViewIssuerPreviewLayout);
