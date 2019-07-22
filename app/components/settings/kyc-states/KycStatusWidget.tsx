import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { branch, compose, renderNothing } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { ERequestOutsourcedStatus, ERequestStatus } from "../../../lib/api/KycApi.interfaces";
import { EUserType } from "../../../lib/api/users/interfaces";
import { actions } from "../../../modules/actions";
import {
  selectBackupCodesVerified,
  selectIsUserEmailVerified,
  selectUserType,
} from "../../../modules/auth/selectors";
import {
  selectExternalKycUrl,
  selectKycLoading,
  selectKycRequestOutsourcedStatus,
  selectKycRequestStatus,
  selectWidgetError,
} from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { EColumnSpan } from "../../layouts/Container";
import { Button, ButtonLink, EButtonLayout, EButtonTheme, EIconPosition } from "../../shared/buttons/index";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { Panel } from "../../shared/Panel";
import { WarningAlert } from "../../shared/WarningAlert";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as infoIcon from "../../../assets/img/notifications/info.svg";
import * as successIcon from "../../../assets/img/notifications/success.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./KycStatusWidget.module.scss";

interface IStateProps {
  requestStatus?: ERequestStatus;
  requestOutsourcedStatus?: ERequestOutsourcedStatus;
  isUserEmailVerified: boolean;
  isLoading: boolean;
  backupCodesVerified: boolean;
  error?: string;
  externalKycUrl?: string;
  userType: EUserType;
}

interface IExternalProps {
  step: number;
  columnSpan?: EColumnSpan;
}

interface IDispatchProps {
  onGoToDashboard: () => void;
  cancelInstantId: () => void;
  onGoToKycHome: () => void;
}

interface IKycStatusLayoutProps {
  requestStatus?: ERequestStatus;
  requestOutsourcedStatus?: ERequestOutsourcedStatus;
  isUserEmailVerified: boolean;
  externalKycUrl?: string;
  userType: EUserType;
  backupCodesVerified: boolean;
}

export type IKycStatusWidgetProps = IStateProps & IDispatchProps & IExternalProps;

const statusTextMap: Record<ERequestStatus, React.ReactNode> = {
  Accepted: <FormattedMessage id="settings.kyc-status-widget.status.accepted" />,
  Rejected: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.rejected"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  Ignored: <FormattedMessage id="settings.kyc-status-widget.status.ignored" />,
  Pending: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.pending"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  Draft: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.draft"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  Outsourced: <FormattedMessage id="settings.kyc-status-widget.status.outsourced.started" />,
};

const outsourcedStatusTextMap: Record<ERequestOutsourcedStatus, React.ReactNode> = {
  review_pending: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
  aborted: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  canceled: (
    <FormattedHTMLMessage
      id="settings.kyc-status-widget.status.outsourced.abortedOrCancelled"
      tagName="span"
    />
  ),
  other: (
    <FormattedHTMLMessage
      tagName="span"
      id="settings.kyc-status-widget.status.outsourced.other-info"
      values={{ url: externalRoutes.neufundSupportHome }}
    />
  ),
  started: <FormattedMessage id="settings.kyc-status-widget.status.outsourced.started" />,
  success: <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />,
  success_data_changed: (
    <FormattedMessage id="settings.kyc-status-widget.status.outsourced.review_pending" />
  ),
};

const getStatus = (
  selectIsUserEmailVerified: boolean,
  requestStatus?: ERequestStatus,
  requestOutsourcedStatus?: ERequestOutsourcedStatus,
): React.ReactNode => {
  if (!selectIsUserEmailVerified) {
    return <FormattedMessage id="settings.kyc-status-widget.status.error-verification-email" />;
  }

  if (!requestStatus) {
    return "";
  }

  if (requestStatus === ERequestStatus.OUTSOURCED && requestOutsourcedStatus) {
    return outsourcedStatusTextMap[requestOutsourcedStatus];
  }

  return statusTextMap[requestStatus];
};

const ActionButton = ({
  requestStatus,
  requestOutsourcedStatus,
  onGoToKycHome,
  isUserEmailVerified,
  externalKycUrl,
  userType,
  onGoToDashboard,
  backupCodesVerified,
  cancelInstantId,
}: IKycStatusLayoutProps & IDispatchProps) => {
  if (requestStatus === ERequestStatus.ACCEPTED && userType === EUserType.INVESTOR) {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        onClick={onGoToDashboard}
        disabled={!isUserEmailVerified}
      >
        <FormattedMessage id="kyc.request-state.go-to-dashboard" />
      </Button>
    );
  }

  if (requestStatus === ERequestStatus.DRAFT) {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified || !backupCodesVerified}
      >
        <FormattedMessage id="settings.kyc-status-widget.start-kyc-process" />
      </Button>
    );
  }

  if (requestStatus === ERequestStatus.PENDING) {
    return (
      <Button
        layout={EButtonLayout.SECONDARY}
        iconPosition={EIconPosition.ICON_AFTER}
        svgIcon={arrowRight}
        onClick={onGoToKycHome}
        disabled={!isUserEmailVerified}
      >
        <FormattedMessage id="settings.kyc-status-widget.submit-additional-documents" />
      </Button>
    );
  }

  if (
    externalKycUrl &&
    requestStatus === ERequestStatus.OUTSOURCED &&
    (requestOutsourcedStatus === ERequestOutsourcedStatus.CANCELED ||
      requestOutsourcedStatus === ERequestOutsourcedStatus.ABORTED ||
      requestOutsourcedStatus === ERequestOutsourcedStatus.STARTED)
  ) {
    return (
      <>
        <ButtonLink
          to={externalKycUrl}
          layout={EButtonLayout.SECONDARY}
          iconPosition={EIconPosition.ICON_AFTER}
          svgIcon={arrowRight}
        >
          <FormattedMessage id="settings.kyc-status-widget.continue-external-kyc" />
        </ButtonLink>
        <Button
          data-test={true}
          layout={EButtonLayout.SECONDARY}
          iconPosition={EIconPosition.ICON_AFTER}
          svgIcon={arrowRight}
          onClick={cancelInstantId}
          data-test-id="settings.kyc-status-widget.cancel-external-kyc-button"
        >
          <FormattedMessage id="settings.kyc-status-widget.cancel-external-kyc" />
        </Button>
      </>
    );
  }

  return null;
};

const StatusIcon = ({
  requestStatus,
  isLoading,
  requestOutsourcedStatus,
}: IKycStatusWidgetProps) => {
  if (isLoading) {
    return null;
  }

  if (
    requestStatus === ERequestStatus.ACCEPTED ||
    (requestStatus === ERequestStatus.OUTSOURCED &&
      [ERequestOutsourcedStatus.SUCCESS, ERequestOutsourcedStatus.SUCCESS_DATA_CHANGED].includes(
        requestOutsourcedStatus!,
      ))
  ) {
    return <img src={successIcon} className={styles.icon} alt="" />;
  }

  if (
    requestStatus === ERequestStatus.PENDING ||
    (requestStatus === ERequestStatus.OUTSOURCED &&
      [
        ERequestOutsourcedStatus.STARTED,
        ERequestOutsourcedStatus.REVIEW_PENDING,
        ERequestOutsourcedStatus.OTHER,
      ].includes(requestOutsourcedStatus!))
  ) {
    return <img src={infoIcon} className={styles.icon} alt="" />;
  }

  return <img src={warningIcon} className={styles.icon} alt="" />;
};

const AccountSetupKycStartLayout: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  isLoading,
  error,
  onGoToKycHome,
}) => {
  if (isLoading) {
    return (
      <div className={styles.panelBody}>
        <Row noGutters>
          <Col>
            <LoadingIndicator className={styles.loading} />
          </Col>
        </Row>
      </div>
    );
  } else if (error) {
    return (
      <WarningAlert>
        <FormattedMessage id="settings.kyc-widget.error" />
      </WarningAlert>
    );
  } else {
    return (
      <section className={styles.accountSetupSection}>
        <p className={styles.accountSetupText}>
          <FormattedMessage id="account-setup.kyc-widget-text"/>
        </p>
        <Button
          layout={EButtonLayout.PRIMARY}
          theme={EButtonTheme.BRAND}
          type="button"
          onClick={onGoToKycHome}
          data-test-id="start-kyc-button"
        >
          <FormattedMessage id="account-setup.kyc-widget-start-kyc" />
        </Button>
      </section>
    );
  }
};


const KycStatusWidgetLayout: React.FunctionComponent<IStateProps & IDispatchProps> = ({
  isLoading,
  error,
  ...props
}) => {
  if (isLoading) {
    return (
      <div className={styles.panelBody}>
        <Row noGutters>
          <Col>
            <LoadingIndicator className={styles.loading} />
          </Col>
        </Row>
      </div>
    );
  } else if (error) {
    return (
      <WarningAlert>
        <FormattedMessage id="settings.kyc-widget.error" />
      </WarningAlert>
    );
  } else {
    return (
      <section className={styles.section}>
        <p className={styles.text}>
          {getStatus(props.isUserEmailVerified, props.requestStatus, props.requestOutsourcedStatus)}
        </p>
        <ActionButton {...props} />
      </section>
    );
  }
};

export const KycStatusWidgetBase: React.FunctionComponent<IKycStatusWidgetProps> = props => {
  const { step, columnSpan, ...rest } = props;

  return (
    <Panel
      columnSpan={columnSpan}
      headerText={<FormattedMessage id="settings.kyc-widget.header" values={{ step }} />}
      rightComponent={<StatusIcon {...props} />}
    >
      <KycStatusWidgetLayout {...rest} />
    </Panel>
  );
};

const connectKycStatusWidget = <T extends {}>(
  WrappedComponent: React.ComponentType<IStateProps & IDispatchProps & T>,
) =>
  compose<(IStateProps | null) & IDispatchProps & T, T>(
    appConnect<IStateProps | null, IDispatchProps, T>({
      stateToProps: state => {
        const userType = selectUserType(state);
        if (userType !== undefined) {
          return {
            userType,
            isUserEmailVerified: selectIsUserEmailVerified(state.auth),
            backupCodesVerified: selectBackupCodesVerified(state),
            requestStatus: selectKycRequestStatus(state),
            requestOutsourcedStatus: selectKycRequestOutsourcedStatus(state.kyc),
            externalKycUrl: selectExternalKycUrl(state.kyc),
            isLoading: selectKycLoading(state.kyc),
            error: selectWidgetError(state.kyc),
          };
        } else {
          return null;
        }
      },
      dispatchToProps: dispatch => ({
        onGoToDashboard: () => dispatch(actions.routing.goToDashboard()),
        cancelInstantId: () => dispatch(actions.kyc.kycCancelInstantId()),
        onGoToKycHome: () => dispatch(actions.routing.goToKYCHome()),
      }),
    }),
    branch<IStateProps | null>(props => props === null, renderNothing),
    // note: initial data for this view are loaded as part of app init process
    onEnterAction({
      actionCreator: d => d(actions.kyc.kycStartWatching()),
    }),
    onLeaveAction({
      actionCreator: d => d(actions.kyc.kycStopWatching()),
    }),
  )(WrappedComponent);

export const KycStatusWidget = connectKycStatusWidget<IExternalProps>(KycStatusWidgetBase);
export const KycStatusComponent = connectKycStatusWidget<{}>(AccountSetupKycStartLayout);
