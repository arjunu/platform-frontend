import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { symbols } from "../../../di/symbols";
import {
  EKycInstantIdProvider,
  TInstantIdNoneProvider,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { OnfidoSDK } from "../../../lib/dependencies/onfido/OnfidoSDK";
import { actions } from "../../../modules/actions";
import { ENotificationText, ENotificationType } from "../../../modules/notifications/types";
import {
  selectKycInstantIdProvider,
  selectKycRecommendedInstantIdProvider,
  selectKycSupportedInstantIdProviders,
} from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { Button, EButtonLayout } from "../../shared/buttons/Button";
import { withDependencies } from "../../shared/hocs/withDependencies";
import { Notification } from "../../shared/notification-widget/Notification";
import { KycStep } from "../shared/KycStep";
import { VerificationMethod } from "../shared/VerificationMethod";

import * as id_now from "../../../assets/img/instant-id/id_now.svg";
import * as onfido from "../../../assets/img/instant-id/onfido.svg";
import * as styles from "./DocumentVerification.module.scss";

interface IStateProps {
  supportedInstantIdProviders?: ReadonlyArray<EKycInstantIdProvider> | TInstantIdNoneProvider;
  recommendedInstantIdProvider?: EKycInstantIdProvider | TInstantIdNoneProvider;
  currentProvider?: EKycInstantIdProvider | TInstantIdNoneProvider;
}

interface IStartInstantIdProps {
  onStartIdNow: () => void;
  onManualVerification: () => void;
}

interface IDispatchProps extends IStartInstantIdProps {
  goBack: () => void;
  goToDashboard: () => void;
}

interface IRecommendedProps {
  recommendedInstantIdProvider: EKycInstantIdProvider | TInstantIdNoneProvider;
  currentProvider?: EKycInstantIdProvider | TInstantIdNoneProvider;
}

const selectProviderLogo = (provider: EKycInstantIdProvider | TInstantIdNoneProvider) => {
  switch (provider) {
    case EKycInstantIdProvider.ID_NOW:
      return id_now;
    case EKycInstantIdProvider.ONFIDO:
      return onfido;
    default:
      return "";
  }
};

const selectProviderText = (provider: EKycInstantIdProvider | TInstantIdNoneProvider) => {
  switch (provider) {
    case EKycInstantIdProvider.ID_NOW:
      return <FormattedMessage id="kyc.document-verification.provider.id-now.text" />;
    case EKycInstantIdProvider.ONFIDO:
      return <FormattedMessage id="kyc.document-verification.provider.onfido.text" />;
    default:
      return "";
  }
};

const selectProviderAction = (
  provider: EKycInstantIdProvider | TInstantIdNoneProvider,
  dispatchers: IStartInstantIdProps,
) => {
  switch (provider) {
    case EKycInstantIdProvider.ID_NOW:
      return dispatchers.onStartIdNow;
    case EKycInstantIdProvider.ONFIDO:
      return () => {};
    default:
      return undefined;
  }
};

type TRenderPropsProp = { onfidoSdk: OnfidoSDK };

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

export const KycPersonalDocumentVerificationComponent: React.FunctionComponent<IStateProps &
  IDispatchProps> = ({
  supportedInstantIdProviders,
  recommendedInstantIdProvider,
  goBack,
  currentProvider,
  goToDashboard,
  ...dispatchers
}) => {
  const enabledInstantIdProviders = getEnabledInstatnIdProviders(supportedInstantIdProviders);
  return (
    <>
      <KycStep
        step={4}
        allSteps={5}
        title={<FormattedMessage id="kyc.personal.verify.title" />}
        description={<FormattedMessage id="kyc.personal.verify.description" />}
        buttonAction={() => goToDashboard()}
      />

      {recommendedInstantIdProvider && (
        <KycPersonalDocumentVerificationRecommended
          currentProvider={currentProvider}
          recommendedInstantIdProvider={recommendedInstantIdProvider}
          {...dispatchers}
        />
      )}
      {enabledInstantIdProviders &&
        enabledInstantIdProviders.length > 0 &&
        (enabledInstantIdProviders as EKycInstantIdProvider[])
          .filter(provider => provider !== recommendedInstantIdProvider)
          .map(provider => (
            <>
              <VerificationMethod
                key={provider}
                data-test-id={`kyc-go-to-outsourced-verification-${provider}`}
                disabled={currentProvider !== "none" && provider !== currentProvider}
                onClick={selectProviderAction(provider, dispatchers)}
                logo={selectProviderLogo(provider)}
                text={selectProviderText(provider)}
                name={provider}
              />
            </>
          ))}
      <div className={styles.buttons}>
        <Button
          layout={EButtonLayout.OUTLINE}
          className={styles.button}
          type="button"
          data-test-id="kyc-personal-verification-go-back"
          onClick={goBack}
        >
          <FormattedMessage id="form.back" />
        </Button>

        {showManualVerification && (
          <Button
            disabled={currentProvider !== "none"}
            layout={EButtonLayout.GHOST}
            className={styles.button}
            type="button"
            data-test-id="kyc-go-to-manual-verification"
            onClick={dispatchers.onManualVerification}
          >
            <FormattedMessage id="kyc.personal.verify.manual" />
          </Button>
        )}
      </div>
    </>
  );
};

export const KycPersonalDocumentVerification = compose<
  IProps & IStateProps & IDispatchProps & TRenderPropsProp,
  {}
>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      supportedInstantIdProviders: selectKycSupportedInstantIdProviders(state),
      recommendedInstantIdProvider: selectKycRecommendedInstantIdProvider(state),
      currentProvider: selectKycInstantIdProvider(state),
    }),
    dispatchToProps: dispatch => ({
      onStartIdNow: () => dispatch(actions.kyc.startIdNowRequest()),
      onStartOnfido: () => dispatch(actions.kyc.startOnfidoRequest()),
      onManualVerification: () => dispatch(actions.routing.goToKYCIndividualUpload()),
      goBack: () => dispatch(actions.routing.goToKYCIndividualAddress()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  withDependencies<TRenderPropsProp>({ onfidoSdk: symbols.onfidoSdk }),
  onLeaveAction({
    actionCreator: d => {
      d(actions.kyc.stopOnfidoRequest());
    },
  }),
)(KycPersonalDocumentVerificationComponent);
