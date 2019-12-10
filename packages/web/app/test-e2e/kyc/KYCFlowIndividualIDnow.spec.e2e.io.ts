import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { ID_NOW_EXTERNAL_MOCK } from "../config";
import { fillForm, TFormFixture, uploadMultipleFilesToFieldWithTid } from "../utils/forms";
import { stubWindow } from "../utils/index";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import {
  kycInvidualAddressForm,
  kycInvidualAddressFormUSResident,
  kycInvidualForm,
  kycInvidualFormUS,
  kycInvidualFormUSResident,
} from "./fixtures";

const goToKycIndividualFlow = () => {
  // go to kyc select and then individual page
  cy.visit(kycRoutes.start);

  cy.get(tid("kyc-start-go-to-personal")).click();
  cy.url().should("contain", kycRoutes.individualStart);
};

const assertOutsourcedVerification = () => {
  stubWindow("windowOpen");

  cy.get(tid("kyc-go-to-outsourced-verification-id_now")).click();

  cy.get("@windowOpen").should("be.calledWithMatch", ID_NOW_EXTERNAL_MOCK, "_blank");

  cy.get(tid("kyc-id-now-started")).should("exist");
};

const assertOutsourcedKycWidgetStatus = () => {
  cy.visit(appRoutes.profile);

  stubWindow("windowOpen");

  cy.get(tid("settings.kyc-status-widget.continue-kyc-verification")).click();

  cy.url().should("contain", kycRoutes.start);
};

const fillAndAssert = (personalData: TFormFixture, addressData: TFormFixture, isUS: boolean) => {
  createAndLoginNewUser({ type: "investor" });

  goToKycIndividualFlow();

  // fill the form
  fillForm(personalData, isUS ? { submit: false } : undefined);

  if (isUS) {
    // form should be disabled before the accreditation file is uploaded
    cy.get(tid("kyc-personal-start-submit-form")).should("be.disabled");

    // Upload accreditation documents
    uploadMultipleFilesToFieldWithTid("kyc-upload-documents-dropzone", ["example.jpg"]);

    cy.get(tid("kyc-personal-start-submit-form")).click();
  }

  fillForm(addressData);

  assertOutsourcedVerification();

  assertOutsourcedKycWidgetStatus();
};

describe("KYC Personal flow with ID Now", () => {
  it("should go through ID Now", function(): void {
    this.retries(2);

    fillAndAssert(kycInvidualForm, kycInvidualAddressForm, false);
  });

  it("should go through ID Now for US investor", function(): void {
    this.retries(2);

    fillAndAssert(kycInvidualFormUS, kycInvidualAddressForm, true);
  });

  it("should go through ID Now for US resident", function(): void {
    this.retries(2);

    fillAndAssert(kycInvidualFormUSResident, kycInvidualAddressFormUSResident, true);
  });
});
