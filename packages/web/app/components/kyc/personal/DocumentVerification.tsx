import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { symbols } from "../../../di/symbols";
import {
  EKycInstantIdProvider,
  EKycRequestStatus,
  TInstantIdNoneProvider,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { OnfidoSDK } from "../../../lib/dependencies/onfido/OnfidoSDK";
import { actions } from "../../../modules/actions";
import { selectKycIdNowRedirectUrl } from "../../../modules/kyc/instant-id/id-now/selectors";
import { selectKycOnfidoRequestStartError } from "../../../modules/kyc/instant-id/onfido/selectors";
import {
  selectKycInstantIdProvider,
  selectKycRecommendedInstantIdProvider,
  selectKycRequestStatus,
  selectKycSupportedInstantIdProviders,
} from "../../../modules/kyc/selectors";
import { ENotificationType } from "../../../modules/notifications/types";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { assertNever } from "../../../utils/assertNever";
import { nonNullable } from "../../../utils/nonNullable";
import { onLeaveAction } from "../../../utils/OnLeaveAction";
import { Button, EButtonLayout, EButtonSize } from "../../shared/buttons/Button";
import { ButtonGroup } from "../../shared/buttons/ButtonGroup";
import { withDependencies } from "../../shared/hocs/withDependencies";
import { ExternalLink } from "../../shared/links/ExternalLink";
import { Notification } from "../../shared/notification-widget/Notification";
import { KycStep } from "../shared/KycStep";
import { VerificationMethod } from "../shared/VerificationMethod";
import {
  getEnabledInstantIdProviders,
  isManualVerificationEnabled,
  NONE_KYC_INSTANTID_PROVIDER,
  selectIsDisabled,
  selectProviderLogo,
} from "../utils";

import * as styles from "./DocumentVerification.module.scss";

interface IStateProps {
  supportedInstantIdProviders: ReadonlyArray<EKycInstantIdProvider>;
  recommendedInstantIdProvider: EKycInstantIdProvider | TInstantIdNoneProvider;
  currentProvider: EKycInstantIdProvider | TInstantIdNoneProvider | undefined;
  requestStatus: EKycRequestStatus | undefined;
  idNowRedirectUrl: string | undefined;
  onfidoRequestStartError: Error | undefined;
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
  recommendedInstantIdProvider: EKycInstantIdProvider;
  currentProvider?: EKycInstantIdProvider | TInstantIdNoneProvider;
  requestStatus: EKycRequestStatus | undefined;
  idNowRedirectUrl: string | undefined;
}

type TDependenciesProps = { onfidoSdk: OnfidoSDK };

const selectProviderText = (provider: EKycInstantIdProvider) => {
  switch (provider) {
    case EKycInstantIdProvider.ID_NOW:
      return <FormattedMessage id="kyc.document-verification.provider.id-now.text" />;
    case EKycInstantIdProvider.ONFIDO:
      return <FormattedMessage id="kyc.document-verification.provider.onfido.text" />;
    default:
      return assertNever(provider);
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

const selectProviderInfoText = (
  provider: EKycInstantIdProvider | TInstantIdNoneProvider,
  requestStatus: EKycRequestStatus | undefined,
  idNowRedirectUrl: string | undefined,
): TTranslatedString | undefined => {
  switch (provider) {
    case EKycInstantIdProvider.ID_NOW:
      return requestStatus === EKycRequestStatus.OUTSOURCED && idNowRedirectUrl !== undefined ? (
        <FormattedMessage
          id="notifications.id-now-started"
          values={{
            link: (
              <ExternalLink data-test-id="kyc-id-now-started" href={idNowRedirectUrl}>
                <FormattedMessage id="kyc.request-state.click-here-to-continue" />
              </ExternalLink>
            ),
          }}
        />
      ) : (
        undefined
      );
    default:
      return undefined;
  }
};
const KycPersonalDocumentVerificationRecommended: React.FunctionComponent<IRecommendedProps &
  IStartInstantIdProps &
  TDependenciesProps> = ({
  recommendedInstantIdProvider,
  currentProvider,
  idNowRedirectUrl,
  onfidoSdk,
  requestStatus,
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
      infoText={selectProviderInfoText(
        recommendedInstantIdProvider,
        requestStatus,
        idNowRedirectUrl,
      )}
      onClick={selectProviderAction(recommendedInstantIdProvider, dispatchers)}
      logo={selectProviderLogo(recommendedInstantIdProvider)}
      text={selectProviderText(recommendedInstantIdProvider)}
      name={recommendedInstantIdProvider}
    />
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
  requestStatus,
  idNowRedirectUrl,
  onfidoRequestStartError,
  ...dispatchers
}) => {
  const enabledInstantIdProviders = getEnabledInstantIdProviders(supportedInstantIdProviders);

  const otherEnabledInstantIdProviders = enabledInstantIdProviders.filter(
    provider => provider !== recommendedInstantIdProvider,
  );

  const shouldShowRecommendedProvider =
    recommendedInstantIdProvider !== NONE_KYC_INSTANTID_PROVIDER &&
    enabledInstantIdProviders.includes(recommendedInstantIdProvider);

  return (
    <>
      <KycStep
        step={4}
        allSteps={5}
        title={<FormattedMessage id="kyc.personal.verify.title" />}
        description={<FormattedMessage id="kyc.personal.verify.description" />}
        buttonAction={() => goToDashboard()}
        data-test-id="kyc.individual-document-verification"
      />

      {onfidoRequestStartError && (
        <Notification
          className="mb-4"
          type={ENotificationType.WARNING}
          text={<FormattedMessage id="kyc.personal.verify.error" />}
        />
      )}

      {enabledInstantIdProviders.length === 0 && (
        <Notification
          className="mb-4"
          type={ENotificationType.INFO}
          text={<FormattedMessage id="kyc.personal.verify.none-providers-allowed" />}
          data-test-id="kyc.individual-document-verification.none-providers-allowed"
        />
      )}

      {shouldShowRecommendedProvider && (
        <>
          <KycPersonalDocumentVerificationRecommended
            currentProvider={currentProvider}
            recommendedInstantIdProvider={recommendedInstantIdProvider as EKycInstantIdProvider}
            onfidoSdk={onfidoSdk}
            requestStatus={requestStatus}
            idNowRedirectUrl={idNowRedirectUrl}
            {...dispatchers}
          />
          {otherEnabledInstantIdProviders.length > 0 && (
            <p className={styles.label}>
              <FormattedMessage id="kyc.personal.document-verification.other" />
            </p>
          )}
        </>
      )}

      {otherEnabledInstantIdProviders.map(provider => (
        <VerificationMethod
          key={provider}
          data-test-id={`kyc-go-to-outsourced-verification-${provider}`}
          disabled={selectIsDisabled(currentProvider, provider, onfidoSdk)}
          errorText={selectProviderErrorText(provider, onfidoSdk)}
          infoText={selectProviderInfoText(provider, requestStatus, idNowRedirectUrl)}
          onClick={selectProviderAction(provider, dispatchers)}
          logo={selectProviderLogo(provider)}
          text={selectProviderText(provider)}
          name={provider}
        />
      ))}

      <ButtonGroup className={styles.buttons}>
        <Button
          layout={EButtonLayout.OUTLINE}
          size={EButtonSize.HUGE}
          className={styles.button}
          data-test-id="kyc-personal-verification-go-back"
          onClick={goBack}
        >
          <FormattedMessage id="form.back" />
        </Button>

        {isManualVerificationEnabled() && (
          <Button
            disabled={currentProvider !== NONE_KYC_INSTANTID_PROVIDER}
            layout={EButtonLayout.GHOST}
            size={EButtonSize.HUGE}
            className={styles.button}
            data-test-id="kyc-go-to-manual-verification"
            onClick={dispatchers.onManualVerification}
          >
            <FormattedMessage id="kyc.personal.verify.manual" />
          </Button>
        )}
      </ButtonGroup>
    </>
  );
};

export const KycPersonalDocumentVerification = compose<
  IStateProps & IDispatchProps & TDependenciesProps,
  {}
>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      supportedInstantIdProviders: nonNullable(selectKycSupportedInstantIdProviders(state)),
      recommendedInstantIdProvider: nonNullable(selectKycRecommendedInstantIdProvider(state)),
      currentProvider: selectKycInstantIdProvider(state),
      requestStatus: selectKycRequestStatus(state),
      idNowRedirectUrl: selectKycIdNowRedirectUrl(state),
      onfidoRequestStartError: selectKycOnfidoRequestStartError(state),
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
