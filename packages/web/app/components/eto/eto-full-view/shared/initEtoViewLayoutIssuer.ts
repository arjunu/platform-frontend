import * as React from "react";
import { compose } from "recompose";

import { TEtoViewData } from "../../../../modules/eto-view/shared/types";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { withMetaTags } from "../../../../utils/withMetaTags.unsafe";
import { Layout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";

export const initEtoViewLayoutIssuer = (WrappedComponent: React.ComponentType<TEtoViewData>) =>
  compose<TEtoViewData, TEtoViewData>(
    createErrorBoundary(ErrorBoundaryLayout),
    withContainer(Layout),
    withMetaTags<TEtoViewData>(({ eto }, intl) => {
      const requiredDataPresent =
        eto.company.brandName && eto.equityTokenName && eto.equityTokenSymbol;

      return {
        title: requiredDataPresent
          ? `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
          : intl.formatIntlMessage("menu.eto-page"),
      };
    }),
  )(WrappedComponent);
