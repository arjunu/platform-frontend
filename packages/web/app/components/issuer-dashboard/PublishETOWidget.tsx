import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { EColumnSpan } from "../layouts/Container";
import { ButtonArrowRight } from "../shared/buttons/Button";
import { DashboardCenteredWidget } from "../shared/dashboard-widget/DashboardWidget";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../shared/errorBoundary/ErrorBoundaryPanel";

interface IDispatchProps {
  publish: () => void;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

export const PublishETOWidgetComponent: React.FunctionComponent<
  IDispatchProps & IExternalProps
> = ({ publish, columnSpan }) => (
  <DashboardCenteredWidget
    data-test-id="eto-dashboard-publish-eto-widget"
    title={<FormattedMessage id="settings.publish-eto.header" />}
    text={<FormattedMessage id="settings.publish-eto.description" />}
    columnSpan={columnSpan}
  >
    <ButtonArrowRight data-test-id="eto-dashboard-publish-eto-widget.publish" onClick={publish}>
      <FormattedMessage id="settings.publish-eto.publish" />
    </ButtonArrowRight>
  </DashboardCenteredWidget>
);

export const PublishETOWidget = compose<IDispatchProps & IExternalProps, IExternalProps>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IDispatchProps>({
    dispatchToProps: dispatch => ({
      publish: () => dispatch(actions.etoFlow.publishDataStart()),
    }),
  }),
)(PublishETOWidgetComponent);
