import {
  EKycInstantIdProvider,
  TInstantIdNoneProvider,
  TManualIdProvider,
} from "../../lib/api/kyc/KycApi.interfaces";
import { OnfidoSDK } from "../../lib/dependencies/onfido/OnfidoSDK";
import { assertNever } from "../../utils/assertNever";

import id_now from "../../assets/img/instant-id/id_now.svg";
import onfido from "../../assets/img/instant-id/onfido.svg";

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
  supportedInstantIdProviders: ReadonlyArray<EKycInstantIdProvider>,
) => {
  const enabledProviders = getEnabledProviders();

  const enabledInstantIdProviders = enabledProviders.filter(p => p !== MANUAL_KYC_PROVIDER);

  // in case we don't have the enabled providers flag set default to all supported providers
  if (enabledInstantIdProviders.length === 0) {
    return supportedInstantIdProviders;
  }

  return supportedInstantIdProviders.filter(p => enabledInstantIdProviders.includes(p));
};

export const isManualVerificationEnabled = () => {
  const enabledProviders = getEnabledProviders();
  return enabledProviders.includes(MANUAL_KYC_PROVIDER);
};
