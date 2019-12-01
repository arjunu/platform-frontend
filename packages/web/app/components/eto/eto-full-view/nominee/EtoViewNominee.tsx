import { compose } from "recompose";

import { TNomineeEtoViewData } from "../../../../modules/eto-view/shared/types";
import { withContainer } from "../../../../utils/withContainer.unsafe";
import { withMetaTags } from "../../../../utils/withMetaTags.unsafe";
import { Layout } from "../../../layouts/Layout";
import { createErrorBoundary } from "../../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../../shared/errorBoundary/ErrorBoundaryLayout";
import { EtoViewNomineeLayout } from "./EtoViewNomineeLayout";

export const EtoViewNominee = compose<TNomineeEtoViewData, TNomineeEtoViewData>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withMetaTags<TNomineeEtoViewData>(({ eto }) => ({
    title: `${eto.company.brandName} - ${eto.equityTokenName} (${eto.equityTokenSymbol})`,
  })),
)(EtoViewNomineeLayout);
