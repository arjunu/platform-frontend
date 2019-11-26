import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EKycRequestStatus } from "../../../lib/api/kyc/KycApi.interfaces";
import { KycStatusWidgetBase } from "./KycStatusWidget";

const commonProps = {
  isUserEmailVerified: true,
  backupCodesVerified: true,
  isKycFlowBlockedByRegion: false,
  isRestrictedCountryInvestor: false,
  isLoading: false,
  error: undefined,
  externalKycUrl: undefined,
  instantIdStatus: undefined,
  step: 1,
  onGoToKycHome: action("onGoToKycHome"),
  onGoToDashboard: action("onGoToDashboard"),
};

storiesOf("KYC/StatusWidget", module)
  .add("blocked by region", () => (
    <KycStatusWidgetBase
      {...commonProps}
      requestStatus={EKycRequestStatus.DRAFT}
      isKycFlowBlockedByRegion={true}
    />
  ))
  .add("email-not-verified", () => (
    <KycStatusWidgetBase
      {...commonProps}
      requestStatus={EKycRequestStatus.DRAFT}
      isUserEmailVerified={false}
    />
  ))
  .add("backup-codes-not-verified", () => (
    <KycStatusWidgetBase
      {...commonProps}
      requestStatus={EKycRequestStatus.DRAFT}
      isUserEmailVerified={true}
      backupCodesVerified={false}
    />
  ))
  .add("draft", () => (
    <KycStatusWidgetBase {...commonProps} requestStatus={EKycRequestStatus.DRAFT} />
  ))
  .add("pending", () => (
    <KycStatusWidgetBase {...commonProps} requestStatus={EKycRequestStatus.PENDING} />
  ))
  .add("rejected", () => (
    <KycStatusWidgetBase {...commonProps} requestStatus={EKycRequestStatus.REJECTED} />
  ))
  .add("accepted", () => (
    <KycStatusWidgetBase {...commonProps} requestStatus={EKycRequestStatus.ACCEPTED} />
  ))
  .add("accepted, but investor is from restricted country", () => (
    <KycStatusWidgetBase
      {...commonProps}
      requestStatus={EKycRequestStatus.ACCEPTED}
      isRestrictedCountryInvestor={true}
    />
  ))
  .add("outsourced", () => (
    <KycStatusWidgetBase {...commonProps} requestStatus={EKycRequestStatus.OUTSOURCED} />
  ))
  .add("error", () => (
    <KycStatusWidgetBase
      {...commonProps}
      error="bla bla error"
      requestStatus={EKycRequestStatus.PENDING}
    />
  ))
  .add("loading", () => (
    <KycStatusWidgetBase
      {...commonProps}
      isLoading={true}
      requestStatus={EKycRequestStatus.PENDING}
    />
  ));
