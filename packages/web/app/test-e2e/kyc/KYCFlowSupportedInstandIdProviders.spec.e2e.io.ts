import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualAddressForm, kycInvidualForm } from "./fixtures";
import {
  assertIndividualAddress,
  assertIndividualDocumentVerification,
  goToPersonalVerification,
} from "./utils";

describe("KYC flow supported instant id providers", () => {
  it("should show a notification when none providers supported for the individual nationality is Vatican", () => {
    createAndLoginNewUser({ type: "investor" });

    goToPersonalVerification();

    fillForm({
      ...kycInvidualForm,
      nationality: {
        value: "VA",
        type: "select",
      },
    });

    assertIndividualAddress();

    fillForm(kycInvidualAddressForm);

    assertIndividualDocumentVerification();

    cy.get(tid("kyc.individual-document-verification.none-providers-allowed")).should("exist");

    // should not show idnow and onfido
    cy.get(tid("kyc-go-to-outsourced-verification-id_now")).should("not.exist");

    cy.get(tid("kyc-go-to-outsourced-verification-onfido")).should("not.exist");
  });

  it("should show only idnow as supported provider when individual nationality is Angola", () => {
    createAndLoginNewUser({ type: "investor" });

    goToPersonalVerification();

    fillForm({
      ...kycInvidualForm,
      nationality: {
        value: "AO",
        type: "select",
      },
    });

    assertIndividualAddress();

    fillForm(kycInvidualAddressForm);

    assertIndividualDocumentVerification();

    cy.get(tid("kyc-go-to-outsourced-verification-id_now")).should("exist");

    cy.get(tid("kyc-go-to-outsourced-verification-onfido")).should("not.exist");
  });

  it("should show only onfido as supported provider when individual nationality is Zimbabwe", () => {
    createAndLoginNewUser({ type: "investor" });

    goToPersonalVerification();

    fillForm({
      ...kycInvidualForm,
      nationality: {
        value: "ZW",
        type: "select",
      },
    });

    assertIndividualAddress();

    fillForm(kycInvidualAddressForm);

    assertIndividualDocumentVerification();

    cy.get(tid("kyc-go-to-outsourced-verification-onfido")).should("exist");

    cy.get(tid("kyc-go-to-outsourced-verification-id_now")).should("not.exist");
  });
});
