import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, renderNothing } from "recompose";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import {
  selectIssuerEtoPreviewCode,
  selectIssuerEtoTemplates,
  selectUploadedInvestmentAgreement,
} from "../../../modules/eto-flow/selectors";
import { selectEtoOnChainState } from "../../../modules/eto/selectors";
import { EETOStateOnChain } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { appRoutes } from "../../appRoutes";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonGroup, ButtonLink } from "../../shared/buttons";
import { Button, EButtonLayout } from "../../shared/buttons/Button";
import {
  DashboardCenteredWidget,
  DashboardLinkWidget,
} from "../../shared/dashboard-widget/DashboardWidget";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryPanel } from "../../shared/errorBoundary/ErrorBoundaryPanel";
import { SignInvestmentAgreement } from "./SignInvestmentAgreement";

interface IDispatchProps {
  downloadAgreementTemplate: (agreementTemplate: IEtoDocument) => void;
}

interface IStateProps {
  stateOnChain: EETOStateOnChain;
  agreementTemplate: IEtoDocument;
  uploadedAgreement: IEtoDocument | undefined;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

export const UploadInvestmentAgreementLayout: React.FunctionComponent<Omit<
  IStateProps,
  "stateOnChain"
> &
  IDispatchProps &
  IExternalProps> = ({ downloadAgreementTemplate, agreementTemplate, columnSpan }) => (
  <DashboardCenteredWidget
    data-test-id="dashboard-upload-signed-isha-widget"
    title={<FormattedMessage id="download-agreement-widget.signing-title" />}
    text={<FormattedMessage id="download-agreement-widget.signing-text" />}
    columnSpan={columnSpan}
  >
    <ButtonGroup>
      <Button
        layout={EButtonLayout.SECONDARY}
        onClick={() => downloadAgreementTemplate(agreementTemplate)}
        data-test-id="dashboard-upload-signed-isha-widget.download-investment-summary"
      >
        <FormattedMessage id="download-agreement-widget.download-investment-summary" />
      </Button>
      <ButtonLink
        layout={EButtonLayout.SECONDARY}
        to={appRoutes.documents}
        component={Button}
        data-test-id="dashboard-upload-signed-isha-widget.upload-signed-isha"
      >
        <FormattedMessage id="download-agreement-widget.download-and-sign" />
      </ButtonLink>
    </ButtonGroup>
  </DashboardCenteredWidget>
);

export const EtoCompletedWidgetLayout: React.ComponentType<IExternalProps> = ({ columnSpan }) => (
  <DashboardLinkWidget
    title={<FormattedMessage id="download-agreement-widget.success-title" />}
    text={<FormattedMessage id="download-agreement-widget.success-text" />}
    columnSpan={columnSpan}
    to={appRoutes.wallet}
    buttonText={<FormattedMessage id="download-agreement-widget.go-to-wallet" />}
  />
);

export const UploadInvestmentAgreement = compose<
  IStateProps & IDispatchProps & IExternalProps,
  IExternalProps
>(
  createErrorBoundary(ErrorBoundaryPanel),
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const previewCode = selectIssuerEtoPreviewCode(state);
      const etoTemplates = selectIssuerEtoTemplates(state)!;
      if (previewCode) {
        return {
          stateOnChain: selectEtoOnChainState(state, previewCode)!,
          agreementTemplate: etoTemplates.investmentSummaryTemplate,
          uploadedAgreement: selectUploadedInvestmentAgreement(state),
        };
      } else {
        return null;
      }
    },
    dispatchToProps: dispatch => ({
      downloadAgreementTemplate: (agreementTemplate: IEtoDocument) =>
        dispatch(actions.etoDocuments.generateTemplate(agreementTemplate)),
    }),
  }),
  branch<IStateProps | null>(props => props === null, renderNothing),
  branch<IStateProps>(props => props.stateOnChain < EETOStateOnChain.Signing, renderNothing),
  branch<IStateProps>(props => props.stateOnChain === EETOStateOnChain.Refund, renderNothing),
  branch<IStateProps & IExternalProps>(
    props => props.stateOnChain > EETOStateOnChain.Signing,
    renderComponent(EtoCompletedWidgetLayout),
  ),
  branch<IStateProps & IExternalProps>(
    props => props.uploadedAgreement !== undefined,
    renderComponent(SignInvestmentAgreement),
  ),
)(UploadInvestmentAgreementLayout);
