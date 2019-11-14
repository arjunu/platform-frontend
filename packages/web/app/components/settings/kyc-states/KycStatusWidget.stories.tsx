import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
  EKycRequestStatus,
  ERequestOutsourcedStatus,
} from "../../../lib/api/kyc/KycApi.interfaces";
import { EUserType } from "../../../lib/api/users/interfaces";
import { KycStatusWidgetBase } from "./KycStatusWidget";

const commonProps = {
  isUserEmailVerified: true,
  backupCodesVerified: true,
  isKycFlowBlockedByRegion: false,
  isLoading: false,
  error: undefined,
  step: 1,
  userType: EUserType.INVESTOR,
  onGoToKycHome: () => {},
  onGoToDashboard: () => {},
  cancelInstantId: () => {},
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
  .add("outsourced-started", () => (
    <KycStatusWidgetBase
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.STARTED}
      externalKycUrl={"https://neufund.org"}
    />
  ))
  .add("outsourced-aborted", () => (
    <KycStatusWidgetBase
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.ABORTED}
    />
  ))
  .add("outsourced-canceled", () => (
    <KycStatusWidgetBase
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.CANCELED}
    />
  ))
  .add("outsourced-other", () => (
    <KycStatusWidgetBase
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.OTHER}
    />
  ))
  .add("outsourced-review_pending", () => (
    <KycStatusWidgetBase
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.REVIEW_PENDING}
    />
  ))
  .add("outsourced-success", () => (
    <KycStatusWidgetBase
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.SUCCESS}
    />
  ))
  .add("outsourced-success-data-changed", () => (
    <KycStatusWidgetBase
      {...commonProps}
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.SUCCESS_DATA_CHANGED}
    />
  ))
  .add("error", () => (
    <KycStatusWidgetBase
      {...commonProps}
      error="bla bla error"
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.REVIEW_PENDING}
    />
  ))
  .add("loading", () => (
    <KycStatusWidgetBase
      {...commonProps}
      isLoading={true}
      userType={EUserType.INVESTOR}
      requestStatus={EKycRequestStatus.OUTSOURCED}
      requestOutsourcedStatus={ERequestOutsourcedStatus.REVIEW_PENDING}
    />
  ));
