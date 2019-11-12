import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { appRoutes } from "../appRoutes";
import { EColumnSpan } from "../layouts/Container";
import { DashboardLinkWidget } from "../shared/dashboard-widget/DashboardWidget";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../shared/errorBoundary/ErrorBoundaryPanel";

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

export const UploadProspectusWidgetComponent: React.FunctionComponent<IExternalProps> = ({
  columnSpan,
}) => (
  <DashboardLinkWidget
    title={<FormattedMessage id="settings.upload-prospectus.title" />}
    text={<FormattedMessage id="settings.upload-prospectus-please-upload-prospectus" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-prospectus.title" />}
    columnSpan={columnSpan}
  />
);

export const UploadProspectusWidget = compose<IExternalProps, IExternalProps>(
  createErrorBoundary(ErrorBoundaryPanel),
)(UploadProspectusWidgetComponent);
