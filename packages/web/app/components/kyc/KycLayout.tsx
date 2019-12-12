import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import {
  EKycInstantIdStatus,
  EKycRequestStatus,
  EKycRequestType,
} from "../../lib/api/kyc/KycApi.interfaces";
import { Button, EButtonLayout, EIconPosition } from "../shared/buttons";
import { KycPanel } from "./KycPanel";
import { KycSubmitedRouter } from "./KycSubmitedRouter";
import { KycRouter } from "./Router";
import { KYCAddDocuments } from "./shared/AddDocuments";

import * as addFile from "../../assets/img/inline_icons/add_file.svg";
import * as arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";

export const personalSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.personal-details" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.documents-verification" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: true,
  },
];

export const businessSteps = [
  {
    label: <FormattedMessage id="kyc.steps.representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.company-details" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.legal-representation" />,
    isChecked: true,
  },
  {
    label: <FormattedMessage id="kyc.steps.review" />,
    isChecked: true,
  },
];

type TExternalProps = {
  requestStatus?: EKycRequestStatus;
  instantIdStatus: EKycInstantIdStatus | undefined;
  idNowRedirectUrl: string | undefined;
  requestType: EKycRequestType | undefined;
  hasVerifiedEmail: boolean;
  goToProfile: () => void;
  goToDashboard: () => void;
};

type TLocalState = {
  showAdditionalFileUpload: boolean;
};

class RequestStateInfo extends React.Component<TExternalProps, TLocalState> {
  state = {
    showAdditionalFileUpload: false,
  };

  render(): React.ReactNode {
    const steps =
      this.props.requestType === EKycRequestType.BUSINESS ? businessSteps : personalSteps;
    // Kyc is pending when either status `Pending` or
    // status is `Outsourced` with outsourced verification status set to `Pending`
    const isKycPending =
      this.props.requestStatus === EKycRequestStatus.PENDING ||
      (this.props.requestStatus === EKycRequestStatus.OUTSOURCED &&
        this.props.instantIdStatus === EKycInstantIdStatus.PENDING);
    const settingsButton = (
      <div className="p-4 text-center">
        <Button
          layout={EButtonLayout.GHOST}
          iconPosition={EIconPosition.ICON_BEFORE}
          svgIcon={arrowLeft}
          onClick={this.props.goToProfile}
        >
          <FormattedMessage id="kyc.request-state.go-to-profile" />
        </Button>
      </div>
    );

    if (!this.props.requestStatus) {
      return (
        <KycPanel
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.description" />}
        >
          {settingsButton}
        </KycPanel>
      );
    }
    if (isKycPending) {
      // TODO: Rework for Business flow
      if (this.props.requestType === EKycRequestType.INDIVIDUAL) {
        return <KycSubmitedRouter />;
      } else {
        // Fallback for non individual user
        return (
          <KycPanel
            title={<FormattedMessage id="kyc.request-state.pending.title" />}
            steps={steps}
            description={<FormattedMessage id="kyc.request-state.pending.description" />}
            data-test-id="kyc-panel-pending"
          >
            {!this.state.showAdditionalFileUpload && (
              <Button
                layout={EButtonLayout.GHOST}
                iconPosition={EIconPosition.ICON_BEFORE}
                svgIcon={addFile}
                onClick={() => this.setState({ showAdditionalFileUpload: true })}
              >
                <FormattedMessage id="kyc.request-state.pending.add-files-button" />
              </Button>
            )}
            {this.props.requestType && this.state.showAdditionalFileUpload && (
              <KYCAddDocuments uploadType={this.props.requestType} />
            )}
            <br /> <br />
            {settingsButton}
          </KycPanel>
        );
      }
    }

    if (this.props.requestStatus === EKycRequestStatus.ACCEPTED) {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.accepted.title" />}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.accepted.description" />}
        >
          {settingsButton}
        </KycPanel>
      );
    }

    if (this.props.requestStatus === EKycRequestStatus.REJECTED) {
      return (
        <KycPanel
          title={<FormattedMessage id="kyc.request-state.rejected.title" />}
          steps={steps}
          description={<FormattedMessage id="kyc.request-state.rejected.description" />}
        >
          {settingsButton}
        </KycPanel>
      );
    }

    return null;
  }
}

const KycLayout: React.FunctionComponent<TExternalProps> = props => {
  // Kyc is draft when either status `Draft` or
  // status is `Outsourced` with outsourced verification status set to `Draft`
  const isKycInDraft =
    props.requestStatus === EKycRequestStatus.DRAFT ||
    (props.requestStatus === EKycRequestStatus.OUTSOURCED &&
      props.instantIdStatus === EKycInstantIdStatus.DRAFT);

  const router = isKycInDraft ? <KycRouter /> : null;
  return (
    <>
      <RequestStateInfo {...props} />
      {router}
    </>
  );
};

export { KycLayout };
