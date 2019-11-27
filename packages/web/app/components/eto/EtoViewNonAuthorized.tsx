import {  compose } from "recompose";

import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { withJurisdictionDisclaimer } from "./shared/routing/withJurisdictionDisclaimer";
import { withJurisdictionRoute } from "./shared/routing/withJurisdictionRoute";
import { TNotAuthorizedEtoViewData, TReadyEtoView } from "../../modules/eto-view/reducer";
import { withMetaTags } from "../../utils/withMetaTags.unsafe";
import { EtoViewNonAuthorizedLayout } from "./shared/EtoViewNonAuthorizedLayout";

export const EtoViewNonAuthorized = compose<TNotAuthorizedEtoViewData, TNotAuthorizedEtoViewData>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withJurisdictionDisclaimer<TReadyEtoView>(props => props.eto.previewCode),
  withJurisdictionRoute<TReadyEtoView>(props => ({
    previewCode: props.eto.previewCode,
    jurisdiction: props.eto.product.jurisdiction,
  })),
  withMetaTags<TReadyEtoView>(({eto}) => ({
      title: `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
    })),
)(EtoViewNonAuthorizedLayout);
