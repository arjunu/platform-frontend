import { kycRoutes } from "../../components/kyc/routes";
import { assertFilteredDeJurisdiction } from "../investor-dashboard/utils";
import { confirmAccessModal } from "../utils";
import { fillForm, TFormFixture, uploadMultipleFilesToFieldWithTid } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import {
  kycInvidualAddressForm,
  kycInvidualAddressFormUSResident,
  kycInvidualForm,
  kycInvidualFormUS,
  kycInvidualFormUSResident,
} from "./fixtures";
import {
  assertIndividualAddress,
  assertIndividualDocumentVerification,
  goToPersonalVerification,
} from "./utils";

const fillAndAssert = (personalData: TFormFixture, addressData: TFormFixture, isUS: boolean) => {
  createAndLoginNewUser({ type: "investor" });

  goToPersonalVerification();

  cy.screenshot();

  // fill personal details form
  fillForm(personalData, isUS ? { submit: false } : undefined);

  if (isUS) {
    // form should be disabled before the accreditation file is uploaded
    cy.get(tid("kyc-personal-start-submit-form")).should("be.disabled");

    // Upload accreditation documents
    uploadMultipleFilesToFieldWithTid("kyc-upload-documents-dropzone", ["example.jpg"]);

    cy.get(tid("kyc-personal-start-submit-form")).click();
  }

  assertIndividualAddress();

  // fill address form
  fillForm(addressData);

  assertIndividualDocumentVerification();

  // go to the manual verification with file upload
  cy.get(tid("kyc-go-to-manual-verification")).awaitedClick();
  cy.url().should("contain", kycRoutes.individualUpload);

  cy.screenshot();

  // upload file
  uploadMultipleFilesToFieldWithTid("kyc-personal-upload-dropzone", ["example.jpg"]);

  // submit request and accept with the wallet
  cy.get(tid("kyc-personal-upload-submit")).awaitedClick();
  confirmAccessModal();

  // panel should now be in pending state
  cy.get(tid("kyc-success")).should("exist");

  cy.screenshot();
};

describe("KYC Personal flow with manual verification", () => {
  it("went through KYC flow with personal data", () => {
    fillAndAssert(kycInvidualForm, kycInvidualAddressForm, false);

    // Tests multi jurisdiction
    assertFilteredDeJurisdiction();
  });

  it("went through KYC flow with personal data for US investor", function(): void {
    this.retries(2);

    createAndLoginNewUser({ type: "investor" });

    fillAndAssert(kycInvidualFormUS, kycInvidualAddressForm, true);
  });

  it("went through KYC flow with personal data for US resident", function(): void {
    this.retries(2);

    createAndLoginNewUser({ type: "investor" });

    fillAndAssert(kycInvidualFormUSResident, kycInvidualAddressFormUSResident, true);
  });
});
