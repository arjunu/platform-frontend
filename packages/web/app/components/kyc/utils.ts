import {
  EKycInstantIdProvider,
  TInstantIdNoneProvider,
  TManualIdProvider,
} from "../../lib/api/kyc/KycApi.interfaces";
import { OnfidoSDK } from "../../lib/dependencies/onfido/OnfidoSDK";
import { assertNever } from "../../utils/assertNever";

import * as id_now from "../../assets/img/instant-id/id_now.svg";
import * as onfido from "../../assets/img/instant-id/onfido.svg";

export const NONE_KYC_INSTANTID_PROVIDER: TInstantIdNoneProvider = "none";
export const MANUAL_KYC_PROVIDER: TManualIdProvider = "manual";

export const selectProviderLogo = (provider: EKycInstantIdProvider) => {
  switch (provider) {
    case EKycInstantIdProvider.ID_NOW:
      return id_now;
    case EKycInstantIdProvider.ONFIDO:
      return onfido;
    default:
      return assertNever(provider);
  }
};

export const selectIsDisabled = (
  currentProvider: EKycInstantIdProvider | TInstantIdNoneProvider | undefined,
  provider: EKycInstantIdProvider | TInstantIdNoneProvider,
  onfidoSDK: OnfidoSDK,
) => {
  if (currentProvider !== NONE_KYC_INSTANTID_PROVIDER && provider !== currentProvider) {
    return true;
  }

  switch (provider) {
    case EKycInstantIdProvider.ONFIDO:
      return !onfidoSDK.isSupported();
    default:
      return false;
  }
};

export const getEnabledProviders = () =>
  process.env.NF_ENABLED_VERIFICATION_PROVIDERS
    ? (process.env.NF_ENABLED_VERIFICATION_PROVIDERS.split(",") as Array<
        EKycInstantIdProvider | TManualIdProvider
      >)
    : [];

export const getEnabledInstantIdProviders = (
  supportedInstantIdProviders:
    | ReadonlyArray<EKycInstantIdProvider>
    | TInstantIdNoneProvider
    | undefined,
) => {
  const enabledProviders = getEnabledProviders();
  return enabledProviders.length > 0
    ? enabledProviders.filter(
        v =>
          supportedInstantIdProviders &&
          v !== MANUAL_KYC_PROVIDER &&
          supportedInstantIdProviders.includes(v),
      )
    : supportedInstantIdProviders && [...supportedInstantIdProviders];
};

export const isManualVerificationEnabled = () => {
  const enabledProviders = getEnabledProviders();
  return enabledProviders && enabledProviders.includes(MANUAL_KYC_PROVIDER);
};
