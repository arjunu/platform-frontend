import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { EKycInstantIdProvider } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import {
  selectKycInstantIdProvider,
  selectKycRecommendedInstantIdProvider,
  selectKycSupportedInstantIdProviders,
} from "../../../modules/kyc/selectors";
import { appConnect } from "../../../store";
import { OmitKeys } from "../../../types";
import { Button, EButtonLayout } from "../../shared/buttons/Button";
import { KycStep } from "../shared/KycStep";
import { VerificationMethod } from "../shared/VerificationMethod";

import * as id_now from "../../../assets/img/instant-id/id_now.svg";
import * as onfido from "../../../assets/img/instant-id/onfido.svg";
import * as styles from "./DocumentVerification.module.scss";

interface IStateProps {
  supportedInstantIdProviders: ReadonlyArray<EKycInstantIdProvider> | undefined;
  recommendedInstantIdProvider?: EKycInstantIdProvider;
  currentProvider?: EKycInstantIdProvider;
}

interface IDispatchProps {
  onStartIdNow: () => void;
  onManualVerification: () => void;
  goBack: () => void;
}

interface IRecommendedProps {
  recommendedInstantIdProvider: EKycInstantIdProvider;
  currentProvider?: EKycInstantIdProvider;
}

const selectProviderLogo = (provider: EKycInstantIdProvider) => {
  switch (provider) {
    case EKycInstantIdProvider.ID_NOW:
      return id_now;
    case EKycInstantIdProvider.ONFIDO:
      return onfido;
    default:
      return "";
  }
};

const selectProviderText = (provider: EKycInstantIdProvider) => {
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
  provider: EKycInstantIdProvider,
  dispatchers: OmitKeys<IDispatchProps, "goBack">,
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

const getEnabledProviders = () =>
  process.env.NF_ENABLED_VERIFICATION_PROVIDERS &&
  process.env.NF_ENABLED_VERIFICATION_PROVIDERS.split(",");

const getEnabledInstatnIdProviders = (
  supportedInstantIdProviders: ReadonlyArray<EKycInstantIdProvider> | undefined,
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

const KycPersonalDocumentVerificationRecomended: React.FunctionComponent<IRecommendedProps &
  OmitKeys<IDispatchProps, "goBack">> = ({
  recommendedInstantIdProvider,
  currentProvider,
  ...dispatchers
}) => (
  <>
    <p className={styles.label}>
      <FormattedMessage id="kyc.personal.document-verification.recommended" />
    </p>
    <VerificationMethod
      disabled={currentProvider && currentProvider !== recommendedInstantIdProvider}
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
  IDispatchProps> = ({
  supportedInstantIdProviders,
  recommendedInstantIdProvider,
  goBack,
  currentProvider,
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
      />

      {recommendedInstantIdProvider && (
        <KycPersonalDocumentVerificationRecomended
          currentProvider={currentProvider}
          recommendedInstantIdProvider={recommendedInstantIdProvider}
          {...dispatchers}
        />
      )}
      {enabledInstantIdProviders &&
        enabledInstantIdProviders
          .filter(provider => provider !== recommendedInstantIdProvider)
          .map(provider => (
            <VerificationMethod
              key={provider}
              disabled={currentProvider && provider !== currentProvider}
              onClick={selectProviderAction(provider, dispatchers)}
              logo={selectProviderLogo(provider)}
              text={selectProviderText(provider)}
              name={provider}
            />
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
            disabled={!!currentProvider}
            layout={EButtonLayout.GHOST}
            className={styles.button}
            type="button"
            data-test-id="kyc-personal-verification-manual"
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
      onStartIdNow: () => dispatch(actions.kyc.kycStartInstantId()),
      onManualVerification: () => dispatch(actions.routing.goToKYCIndividualUpload()),
      goBack: () => dispatch(actions.routing.goToKYCIndividualAddress()),
    }),
  }),
)(KycPersonalDocumentVerificationComponent);
