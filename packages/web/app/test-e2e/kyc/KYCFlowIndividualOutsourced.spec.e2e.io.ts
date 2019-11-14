import { kycRoutes } from "../../components/kyc/routes";
import { fillForm, uploadMultipleFilesToFieldWithTid } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualForm, kycInvidualFormUS } from "./fixtures";

describe("KYC Personal flow with manual verification", () => {
  it("went through KYC flow with personal data", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      // go to kyc select and then individual page
      cy.visit(kycRoutes.start);
      cy.get(tid("kyc-start-go-to-personal")).awaitedClick();
      cy.url().should("contain", kycRoutes.individualStart);

      // fill and submit the form
      fillForm(kycInvidualForm);

      // go to the outsource option
      cy.get(tid("kyc-go-to-outsourced-verification")).awaitedClick();

      // we should now be on the document verification page
      cy.url().should("contain", kycRoutes.individualDocumentVerification);
    });
  });

  it("went through KYC flow with personal data for US investor", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      // go to kyc select and then individual page
      cy.visit(kycRoutes.start);
      cy.get(tid("kyc-start-go-to-personal")).awaitedClick();
      cy.url().should("contain", kycRoutes.individualStart);

      // fill the form
      fillForm(kycInvidualFormUS, { submit: false });

      // Upload accreditation documents
      uploadMultipleFilesToFieldWithTid("kyc-personal-accreditation-upload-dropzone", [
        "example.jpg",
      ]);

      cy.get(tid("kyc-personal-start-submit-form")).awaitedClick();

      // go to the outsource option
      cy.get(tid("kyc-go-to-outsourced-verification")).awaitedClick();

      // we should now be on the document verification page
      cy.url().should("contain", kycRoutes.individualDocumentVerification);
    });
  });
});
