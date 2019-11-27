import {  compose } from "recompose";

import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { TNomineeEtoViewData } from "../../modules/eto-view/reducer";
import { withMetaTags } from "../../utils/withMetaTags.unsafe";
import { EtoViewNomineeLayout } from "./shared/EtoViewNomineeLayout";

export const EtoViewNominee = compose<TNomineeEtoViewData, TNomineeEtoViewData>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withMetaTags<TNomineeEtoViewData>(({eto}) => ({
    title: `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`
  })),
)(EtoViewNomineeLayout);
