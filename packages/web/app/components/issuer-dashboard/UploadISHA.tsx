import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { appRoutes } from "../appRoutes";
import { EColumnSpan } from "../layouts/Container";
import { ButtonGroup, ButtonLink } from "../shared/buttons";
import { ButtonArrowRight } from "../shared/buttons/Button";
import { DashboardCenteredWidget } from "../shared/dashboard-widget/DashboardWidget";

interface IExternalProps {
  columnSpan: EColumnSpan;
}

export const UploadISHA: React.FunctionComponent<IExternalProps> = ({ columnSpan }) => (
  <DashboardCenteredWidget
    data-test-id="dashboard-upload-isha-widget"
    title={<FormattedMessage id="settings.upload-isha.title" />}
    text={<FormattedMessage id="settings.upload-isha.text" />}
    columnSpan={columnSpan}
  >
    <ButtonGroup>
      <ButtonLink to={appRoutes.documents} component={ButtonArrowRight}>
        <FormattedMessage id="settings.upload-isha.download-summary.button" />
      </ButtonLink>
      <ButtonLink
        to={appRoutes.documents}
        component={ButtonArrowRight}
        data-test-id="dashboard-upload-isha-widget.call-to-action"
      >
        <FormattedMessage id="settings.upload-isha.button" />
      </ButtonLink>
    </ButtonGroup>
  </DashboardCenteredWidget>
);
