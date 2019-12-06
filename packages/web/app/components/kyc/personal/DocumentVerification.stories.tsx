import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EKycInstantIdProvider } from "../../../lib/api/kyc/KycApi.interfaces";
import { OnfidoSDK } from "../../../lib/dependencies/onfido/OnfidoSDK";
import { NONE_KYC_INSTANTID_PROVIDER } from "../utils";
import { KycPersonalDocumentVerificationComponent } from "./DocumentVerification";

const supportedInstantIdProviders: ReadonlyArray<EKycInstantIdProvider> = [
  EKycInstantIdProvider.ONFIDO,
  EKycInstantIdProvider.ID_NOW,
];

const commonProps = {
  onStartIdNow: action("onStartIdNow"),
  onStartOnfido: action("onStartOnfido"),
  onManualVerification: action("onManualVerification"),
  goBack: action("goBack"),
  goToDashboard: action("goToDashboard"),
  onfidoSdk: { isSupported: () => true } as OnfidoSDK,
  currentProvider: NONE_KYC_INSTANTID_PROVIDER,
};

storiesOf("organisms|KYC/DocumentVerification", module)
  .add("with recommended Onfido", () => (
    <KycPersonalDocumentVerificationComponent
      recommendedInstantIdProvider={EKycInstantIdProvider.ONFIDO}
      supportedInstantIdProviders={supportedInstantIdProviders}
      {...commonProps}
    />
  ))
  .add("with recommended IDnow", () => (
    <KycPersonalDocumentVerificationComponent
      recommendedInstantIdProvider={EKycInstantIdProvider.ID_NOW}
      supportedInstantIdProviders={supportedInstantIdProviders}
      {...commonProps}
    />
  ))
  .add("without recommended", () => (
    <KycPersonalDocumentVerificationComponent
      recommendedInstantIdProvider={NONE_KYC_INSTANTID_PROVIDER}
      supportedInstantIdProviders={supportedInstantIdProviders}
      {...commonProps}
    />
  ))
  .add("with no providers", () => (
    <KycPersonalDocumentVerificationComponent
      recommendedInstantIdProvider={NONE_KYC_INSTANTID_PROVIDER}
      supportedInstantIdProviders={[]}
      {...commonProps}
    />
  ))
  .add("with started verification", () => (
    <KycPersonalDocumentVerificationComponent
      {...commonProps}
      recommendedInstantIdProvider={NONE_KYC_INSTANTID_PROVIDER}
      currentProvider={EKycInstantIdProvider.ID_NOW}
      supportedInstantIdProviders={supportedInstantIdProviders}
    />
  ))
  .add("with Onfido recommended but not supported by browser", () => (
    <KycPersonalDocumentVerificationComponent
      {...commonProps}
      recommendedInstantIdProvider={EKycInstantIdProvider.ONFIDO}
      supportedInstantIdProviders={supportedInstantIdProviders}
      onfidoSdk={{ isSupported: () => false } as OnfidoSDK}
    />
  ));
