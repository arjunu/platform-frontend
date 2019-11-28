import {  compose } from "recompose";

import { withContainer } from "../../../../utils/withContainer.unsafe";
import { Layout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { withJurisdictionDisclaimer } from "../shared/jurisdiction-utils/withJurisdictionDisclaimer";
import { withJurisdictionRoute } from "../shared/jurisdiction-utils/withJurisdictionRoute";
import { TNotAuthorizedEtoViewData } from "../../../../modules/eto-view/reducer";
import { withMetaTags } from "../../../../utils/withMetaTags.unsafe";
import { EtoViewNonAuthorizedLayout } from "./EtoViewNonAuthorizedLayout";

export const EtoViewNonAuthorized = compose<TNotAuthorizedEtoViewData, TNotAuthorizedEtoViewData>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withJurisdictionDisclaimer<TNotAuthorizedEtoViewData>(props => props.eto.previewCode),
  withJurisdictionRoute<TNotAuthorizedEtoViewData>(props => ({
    previewCode: props.eto.previewCode,
    jurisdiction: props.eto.product.jurisdiction,
  })),
  withMetaTags<TNotAuthorizedEtoViewData>(({eto}) => ({
      title: `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
    })),
)(EtoViewNonAuthorizedLayout);
