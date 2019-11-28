import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { fillForm, uploadMultipleFilesToFieldWithTid } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualForm, kycInvidualFormUS } from "./fixtures";

const initiateIDNowKyc = (isUSInvestor: boolean) => {
  // go to kyc select and then individual page
  cy.visit(kycRoutes.start);

  cy.get(tid("kyc-start-go-to-personal")).click();

  cy.url().should("contain", kycRoutes.individualStart);

  if (isUSInvestor) {
    // fill the form
    fillForm(kycInvidualFormUS, { submit: false });

    // Upload accreditation documents
    uploadMultipleFilesToFieldWithTid("kyc-personal-accreditation-upload-dropzone", [
      "example.jpg",
    ]);

    cy.get(tid("kyc-personal-start-submit-form")).click();
  } else {
    // fill and submit the form
    fillForm(kycInvidualForm);
  }

  cy.get(tid("kyc-go-to-outsourced-verification")).click();

  cy.get(tid("kyc-panel-outsourced")).should("exist");
};

describe("KYC Personal flow with ID Now", () => {
  it("should go through ID Now", () => {
    createAndLoginNewUser({ type: "investor" });

    initiateIDNowKyc(false);

    cy.visit(appRoutes.profile);

    // TODO: Improve e2e tests to check redirect and link inside kyc flow

    cy.get(tid("settings.kyc-status-widget.continue-kyc-idnow-verification")).click();
  });

  it("should go through ID Now for US investor", () => {
    createAndLoginNewUser({ type: "investor" });

    initiateIDNowKyc(true);

    cy.visit(appRoutes.profile);

    // TODO: Improve e2e tests to check redirect and link inside kyc flow

    cy.get(tid("settings.kyc-status-widget.continue-kyc-idnow-verification")).click();
  });
});
