import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../appRoutes";
import { EColumnSpan } from "../layouts/Container";
import { DashboardLinkWidget } from "../shared/dashboard-widget/DashboardWidget";

interface IExternalProps {
  columnSpan: EColumnSpan;
}

export const UploadInvestmentMemorandum: React.FunctionComponent<IExternalProps> = ({
  columnSpan,
}) => (
  <DashboardLinkWidget
    data-test-id="dashboard-upload-investment-memorandum-widget"
    title={<FormattedMessage id="settings.upload-investment-memorandum.title" />}
    text={<FormattedMessage id="settings.upload-investment-memorandum-please-upload-prospectus" />}
    to={appRoutes.documents}
    buttonText={<FormattedMessage id="settings.upload-investment-button.title" />}
    columnSpan={columnSpan}
  />
);
