import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycRequestType } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Button, EIconPosition } from "../../shared/buttons";
import { KycPanel } from "../KycPanel";
import { kycRoutes } from "../routes";

import * as idImage from "../../../assets/img/id_now.svg";
import * as arrowRightIcon from "../../../assets/img/inline_icons/arrow_right.svg";
import * as linkOutIcon from "../../../assets/img/inline_icons/link_out_small.svg";
import * as styles from "./DocumentVerification.module.scss";

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
    isChecked: false,
  },
];

interface IStateProps {}

interface IDispatchProps {
  onStartInstantId: () => void;
  onManualVerification: () => void;
}

interface IProps {
  layout: EKycRequestType;
}

export const KycPersonalDocumentVerificationComponent: React.FunctionComponent<IProps &
  IStateProps &
  IDispatchProps> = ({ ...props }) => (
  <KycPanel
    title={<FormattedMessage id="kyc.panel.individual-verification" />}
    steps={personalSteps}
    backLink={kycRoutes.individualStart}
    isMaxWidth={false}
    fullHeightContent={true}
  >
    <div className={styles.description} data-test-id="kyc-panel-description">
      <FormattedHTMLMessage
        tagName="span"
        id="kyc.personal.instant-id.manual-verification-description"
      />
    </div>

    <div className="mb-5 text-center">
      <Button
        onClick={props.onManualVerification}
        svgIcon={arrowRightIcon}
        iconPosition={EIconPosition.ICON_AFTER}
        data-test-id="kyc-go-to-manual-verification"
      >
        <FormattedMessage id="kyc.personal.instant-id.go-to-manual-verification" />
      </Button>
    </div>
    <div className={styles.description} data-test-id="kyc-panel-description">
      <FormattedHTMLMessage tagName="span" id="kyc.personal.instant-id.description" />
    </div>
    <img className={styles.image} src={idImage} alt="id now" />
    <div className="mb-5 text-center">
      <Button
        onClick={props.onStartInstantId}
        svgIcon={linkOutIcon}
        iconPosition={EIconPosition.ICON_AFTER}
        data-test-id="kyc-go-to-outsourced-verification"
      >
        <FormattedMessage id="kyc.personal.instant-id.go-to-video-verification" />
      </Button>
    </div>
  </KycPanel>
);

export const KycPersonalDocumentVerification = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    dispatchToProps: dispatch => ({
      onStartInstantId: () => dispatch(actions.kyc.kycStartInstantId()),
      onManualVerification: () => dispatch(actions.routing.goToKYCIndividualUpload()),
    }),
  }),
)(KycPersonalDocumentVerificationComponent);
