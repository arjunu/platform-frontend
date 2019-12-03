import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EKycInstantIdProvider } from "../../../lib/api/kyc/KycApi.interfaces";
import { KycPersonalDocumentVerificationComponent } from "./DocumentVerification";

const supportedInstantIdProviders: ReadonlyArray<EKycInstantIdProvider> = [
  EKycInstantIdProvider.ONFIDO,
  EKycInstantIdProvider.ID_NOW,
];

storiesOf("organisms|KYC/DocumentVerification", module)
  .add("with recommended Onfido", () => (
    <KycPersonalDocumentVerificationComponent
      recommendedInstantIdProvider={EKycInstantIdProvider.ONFIDO}
      supportedInstantIdProviders={supportedInstantIdProviders}
      onStartIdNow={action("ID_NOW")}
      onManualVerification={action("MANUAL")}
      goBack={action("GO_BACK")}
    />
  ))
  .add("with recommended IDnow", () => (
    <KycPersonalDocumentVerificationComponent
      recommendedInstantIdProvider={EKycInstantIdProvider.ID_NOW}
      supportedInstantIdProviders={supportedInstantIdProviders}
      onStartIdNow={action("ID_NOW")}
      onManualVerification={action("MANUAL")}
      goBack={action("GO_BACK")}
    />
  ))
  .add("without recommended", () => (
    <KycPersonalDocumentVerificationComponent
      supportedInstantIdProviders={supportedInstantIdProviders}
      onStartIdNow={action("ID_NOW")}
      onManualVerification={action("MANUAL")}
      goBack={action("GO_BACK")}
    />
  ))
  .add("with no providers", () => (
    <KycPersonalDocumentVerificationComponent
      supportedInstantIdProviders={[]}
      onStartIdNow={action("ID_NOW")}
      onManualVerification={action("MANUAL")}
      goBack={action("GO_BACK")}
    />
  ));
