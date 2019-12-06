import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { symbols } from "../../../di/symbols";
import {
  EKycInstantIdProvider,
  TInstantIdNoneProvider,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { OnfidoSDK } from "../../../lib/dependencies/onfido/OnfidoSDK";
import { actions } from "../../../modules/actions";
import {
  selectKycInstantIdProvider,
  selectKycRecommendedInstantIdProvider,
  selectKycSupportedInstantIdProviders,
} from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { Button, EButtonLayout } from "../../shared/buttons/Button";
import { withDependencies } from "../../shared/hocs/withDependencies";
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
  onStartOnfido: () => void;
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

type TDependenciesProps = { onfidoSdk: OnfidoSDK };

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
      return dispatchers.onStartOnfido;
    default:
      return undefined;
  }
};

const selectIsDisabled = (
  currentProvider: EKycInstantIdProvider | TInstantIdNoneProvider | undefined,
  provider: EKycInstantIdProvider | TInstantIdNoneProvider,
  onfidoSDK: OnfidoSDK,
) => {
  if (currentProvider !== "none" && provider !== currentProvider) {
    return true;
  }

  switch (provider) {
    case EKycInstantIdProvider.ONFIDO:
      return !onfidoSDK.isSupported();
    default:
      return false;
  }
};

const selectProviderErrorText = (
  provider: EKycInstantIdProvider | TInstantIdNoneProvider,
  onfidoSDK: OnfidoSDK,
) => {
  switch (provider) {
    case EKycInstantIdProvider.ONFIDO:
      return onfidoSDK.isSupported() ? (
        undefined
      ) : (
        <FormattedMessage id="notifications.not-supported-onfido-browser" />
      );
    default:
      return undefined;
  }
};

const getEnabledProviders = () =>
  process.env.NF_ENABLED_VERIFICATION_PROVIDERS &&
  process.env.NF_ENABLED_VERIFICATION_PROVIDERS.split(",");

const getEnabledInstatnIdProviders = (
  supportedInstantIdProviders:
    | ReadonlyArray<EKycInstantIdProvider>
    | TInstantIdNoneProvider
    | undefined,
) => {
  const enabledProviders = getEnabledProviders() as EKycInstantIdProvider[];
  return enabledProviders
    ? enabledProviders.filter(
        v => supportedInstantIdProviders && supportedInstantIdProviders.includes(v),
      )
    : supportedInstantIdProviders && [...supportedInstantIdProviders];
};

const showManualVerification = () => {
  const enabledProviders = getEnabledProviders();
  return enabledProviders && enabledProviders.includes("manual");
};

const KycPersonalDocumentVerificationRecommended: React.FunctionComponent<IRecommendedProps &
  IStartInstantIdProps &
  TDependenciesProps> = ({
  recommendedInstantIdProvider,
  currentProvider,
  onfidoSdk,
  ...dispatchers
}) => (
  <>
    <p className={styles.label}>
      <FormattedMessage id="kyc.personal.document-verification.recommended" />
    </p>
    <VerificationMethod
      data-test-id={`kyc-go-to-outsourced-verification-${recommendedInstantIdProvider}`}
      disabled={selectIsDisabled(currentProvider, recommendedInstantIdProvider, onfidoSdk)}
      errorText={selectProviderErrorText(recommendedInstantIdProvider, onfidoSdk)}
      onClick={selectProviderAction(recommendedInstantIdProvider, dispatchers)}
      logo={selectProviderLogo(recommendedInstantIdProvider)}
      text={selectProviderText(recommendedInstantIdProvider)}
      name={recommendedInstantIdProvider}
    />
    <p className={styles.label}>
      <FormattedMessage id="kyc.personal.document-verification.other" />
    </p>
  </>
);

export const KycPersonalDocumentVerificationComponent: React.FunctionComponent<IStateProps &
  IDispatchProps &
  TDependenciesProps> = ({
  supportedInstantIdProviders,
  recommendedInstantIdProvider,
  goBack,
  currentProvider,
  goToDashboard,
  onfidoSdk,
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
          onfidoSdk={onfidoSdk}
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
                disabled={selectIsDisabled(currentProvider, provider, onfidoSdk)}
                errorText={selectProviderErrorText(provider, onfidoSdk)}
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

export const KycPersonalDocumentVerification = compose<React.FunctionComponent>(
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
  withDependencies<TDependenciesProps>({ onfidoSdk: symbols.onfidoSdk }),
  onLeaveAction({
    actionCreator: d => {
      d(actions.kyc.stopOnfidoRequest());
    },
  }),
)(KycPersonalDocumentVerificationComponent);
