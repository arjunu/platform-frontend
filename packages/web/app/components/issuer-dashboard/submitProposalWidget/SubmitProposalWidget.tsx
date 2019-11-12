import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonArrowRight } from "../../shared/buttons/index";
import { DashboardCenteredWidget } from "../../shared/dashboard-widget/DashboardWidget";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";

interface IDispatchProps {
  submitProposal: () => void;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

export const SubmitProposalWidgetComponent: React.FunctionComponent<
  IDispatchProps & IExternalProps
> = ({ submitProposal, columnSpan }) => (
  <DashboardCenteredWidget
    title={<FormattedMessage id="settings.submit-your-proposal.header" />}
    text={<FormattedMessage id="settings.submit-your-proposal.description" />}
    columnSpan={columnSpan}
  >
    <ButtonArrowRight data-test-id="eto-dashboard-submit-proposal" onClick={submitProposal}>
      <FormattedMessage id="settings.submit-your-proposal.publish" />
    </ButtonArrowRight>
  </DashboardCenteredWidget>
);

export const SubmitProposalWidget = compose<React.FunctionComponent<IExternalProps>>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IDispatchProps>({
    dispatchToProps: dispatch => ({
      submitProposal: () => dispatch(actions.etoFlow.submitDataStart()),
    }),
  }),
)(SubmitProposalWidgetComponent);
