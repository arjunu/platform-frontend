import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { symbols } from "../../../di/symbols";
import { EKycRequestType } from "../../../lib/api/kyc/KycApi.interfaces";
import { OnfidoSDK } from "../../../lib/dependencies/onfido/OnfidoSDK";
import { actions } from "../../../modules/actions";
import { ENotificationText, ENotificationType } from "../../../modules/notifications/types";
import { appConnect } from "../../../store";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { Button, EIconPosition } from "../../shared/buttons";
import { withDependencies } from "../../shared/hocs/withDependencies";
import { Notification } from "../../shared/notification-widget/Notification";
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
  onStartIdNow: () => void;
  onStartOnfido: () => void;
  onManualVerification: () => void;
}

interface IProps {
  layout: EKycRequestType;
}

type TRenderPropsProp = { onfidoSdk: OnfidoSDK };

export const KycPersonalDocumentVerificationComponent: React.FunctionComponent<IProps &
  IStateProps &
  IDispatchProps &
  TRenderPropsProp> = ({ onfidoSdk, ...props }) => (
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
        onClick={props.onStartIdNow}
        svgIcon={linkOutIcon}
        iconPosition={EIconPosition.ICON_AFTER}
        data-test-id="kyc-go-to-id-now-verification"
      >
        <FormattedMessage id="kyc.personal.instant-id.go-to-id-now-verification" />
      </Button>
    </div>

    {!onfidoSdk.isSupported() && (
      <Notification
        text={ENotificationText.NOT_SUPPORTED_ONFIDO_BROWSER}
        type={ENotificationType.WARNING}
        className="mb-4"
      />
    )}

    <div className="mb-5 text-center">
      <Button
        disabled={!onfidoSdk.isSupported()}
        onClick={props.onStartOnfido}
        svgIcon={linkOutIcon}
        iconPosition={EIconPosition.ICON_AFTER}
        data-test-id="kyc-go-to-onfido-verification"
      >
        <FormattedMessage id="kyc.personal.instant-id.go-to-onfido-verification" />
      </Button>
    </div>
  </KycPanel>
);

export const KycPersonalDocumentVerification = compose<
  IProps & IStateProps & IDispatchProps & TRenderPropsProp,
  {}
>(
  appConnect<IStateProps, IDispatchProps>({
    dispatchToProps: dispatch => ({
      onStartIdNow: () => dispatch(actions.kyc.startIdNowRequest()),
      onStartOnfido: () => dispatch(actions.kyc.startOnfidoRequest()),
      onManualVerification: () => dispatch(actions.routing.goToKYCIndividualUpload()),
    }),
  }),
  withDependencies<TRenderPropsProp>({ onfidoSdk: symbols.onfidoSdk }),
  onLeaveAction({
    actionCreator: d => {
      d(actions.kyc.stopOnfidoRequest());
    },
  }),
)(KycPersonalDocumentVerificationComponent);
