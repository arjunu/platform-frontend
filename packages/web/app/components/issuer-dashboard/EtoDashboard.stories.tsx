import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { EEtoState } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { withStore } from "../../utils/react-connected-components/storeDecorator.unsafe";
import { EtoDashboardLayout } from "./EtoDashboard";
import { EEtoStep } from "./utils";

// KYC is not filled
const verificationStep = {
  backupCodesVerified: true,
  shouldViewEtoSettings: false,
  shouldViewMarketingSubmissionSection: false,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: false,
  isOfferingDocumentSubmitted: false,
  eto: { ...testEto, state: EEtoState.PREVIEW },
  offeringDocumentType: EOfferingDocumentType.PROSPECTUS,
  isLightWallet: true,
  isVerificationSectionDone: false,
  loadFileDataStart: action("loadFileDataStart"),
  userHasKycAndEmailVerified: false,
  shouldViewSubmissionSection: false,
  etoStep: EEtoStep.VERIFICATION,
  isISHASubmitted: false,
};

// Fill in information about your company
const companyInformationStep = {
  ...verificationStep,
  isVerificationSectionDone: true,
  userHasKycAndEmailVerified: true,
  etoStep: EEtoStep.FILL_INFORMATION_ABOUT_COMPANY,
};

// Publish your listing page
const publishListingPageStep = {
  ...companyInformationStep,
  shouldViewEtoSettings: true,
  shouldViewMarketingSubmissionSection: true,
  etoStep: EEtoStep.PUBLISH_LISTING_PAGE,
};

// Publish your listing page
const publishListingPageStepFilled = {
  ...publishListingPageStep,
  shouldViewSubmissionSection: true,
  shouldViewMarketingSubmissionSection: true,
};

// Listing page in review
const listingPageInReviewStep = {
  ...publishListingPageStep,
  shouldViewMarketingSubmissionSection: false,
  etoStep: EEtoStep.LISTING_PAGE_IN_REVIEW,
};

const listingPageInReviewStepFilled = {
  ...publishListingPageStepFilled,
  shouldViewMarketingSubmissionSection: false,
  etoStep: EEtoStep.LISTING_PAGE_IN_REVIEW,
};

// Set up your ETO
const uploadTermsheetStep = {
  ...listingPageInReviewStep,
  etoStep: EEtoStep.UPLOAD_SIGNED_TERMSHEET,
};

const uploadTermsheetStepFilled = {
  ...listingPageInReviewStepFilled,
  etoStep: EEtoStep.UPLOAD_SIGNED_TERMSHEET,
};

const publishInvestmentStep = {
  ...uploadTermsheetStepFilled,
  isTermSheetSubmitted: true,
  etoStep: EEtoStep.PUBLISH_INVESTMENT_OFFER,
};

const investmentOfferInReviewStep = {
  ...publishInvestmentStep,
  eto: { ...publishInvestmentStep.eto, state: EEtoState.PENDING },
  etoStep: EEtoStep.INVESTMENT_OFFER_IN_REVIEW,
};

const uploadOfferingDocumentProspectusStep = {
  ...publishInvestmentStep,
  eto: { ...publishInvestmentStep.eto, state: EEtoState.LISTED },
  etoStep: EEtoStep.UPLOAD_OFFERING_DOCUMENT,
};

const uploadOfferingDocumentMemorandumStep = {
  ...uploadOfferingDocumentProspectusStep,
  offeringDocumentType: EOfferingDocumentType.MEMORANDUM,
};

const uploadISHAStep = {
  ...uploadOfferingDocumentProspectusStep,
  etoStep: EEtoStep.UPLOAD_ISHA,
  isOfferingDocumentSubmitted: true,
};

const waitingForContractsStep = {
  ...uploadISHAStep,
  etoStep: EEtoStep.WAIT_FOR_SMART_CONTRACT,
  isISHASubmitted: true,
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(withStore(mockedStore))
  .add("Verification", () => <EtoDashboardLayout {...verificationStep} />)
  .add("Company info", () => <EtoDashboardLayout {...companyInformationStep} />)
  .add("Publish listing (ETO not filled)", () => <EtoDashboardLayout {...publishListingPageStep} />)
  .add("Publish listing (ETO filled)", () => (
    <EtoDashboardLayout {...publishListingPageStepFilled} />
  ))
  .add("Publish pending (ETO not filled)", () => (
    <EtoDashboardLayout {...listingPageInReviewStep} />
  ))
  .add("Publish pending (ETO filled)", () => (
    <EtoDashboardLayout {...listingPageInReviewStepFilled} />
  ))
  .add("Set up ETO (ETO not filled)", () => <EtoDashboardLayout {...uploadTermsheetStep} />)
  .add("Set up ETO (ETO filled)", () => <EtoDashboardLayout {...uploadTermsheetStepFilled} />)
  .add("Publish your investment offer", () => <EtoDashboardLayout {...publishInvestmentStep} />)
  .add("Investment offer in review", () => <EtoDashboardLayout {...investmentOfferInReviewStep} />)
  .add("Upload offering document (Prospectus)", () => (
    <EtoDashboardLayout {...uploadOfferingDocumentProspectusStep} />
  ))
  .add("Upload offering document (Memorandum)", () => (
    <EtoDashboardLayout {...uploadOfferingDocumentMemorandumStep} />
  ))
  .add("Upload ISHA step", () => <EtoDashboardLayout {...uploadISHAStep} />)
  .add("Waiting for contracts step", () => <EtoDashboardLayout {...waitingForContractsStep} />);
