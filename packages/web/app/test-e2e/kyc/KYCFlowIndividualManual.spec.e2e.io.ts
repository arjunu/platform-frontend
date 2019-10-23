import { kycRoutes } from "../../components/kyc/routes";
import {
  assertAllJurisdictionEtosExist,
  assertFilteredDeJurisdiction,
} from "../investor-dashboard/utils";
import { confirmAccessModal } from "../utils";
import { fillForm, uploadMultipleFilesToFieldWithTid } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualForm } from "./fixtures";

describe.skip("KYC Personal flow with manual verification", () => {
  it("went through KYC flow with personal data", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      // TODO: Move to a separate test
      // Tests multi jurisdiction
      assertAllJurisdictionEtosExist();
      // go to kyc select and then individual page
      cy.visit(kycRoutes.start);
      cy.get(tid("kyc-start-go-to-personal")).awaitedClick();
      cy.url().should("contain", kycRoutes.individualStart);

      // fill and submit the form
      fillForm(kycInvidualForm);

      // go to the manual verification with file upload
      cy.get(tid("kyc-go-to-manual-verification")).awaitedClick();
      cy.url().should("contain", kycRoutes.individualUpload);

      // upload file
      uploadMultipleFilesToFieldWithTid("kyc-personal-upload-dropzone", ["example.jpg"]);

      // submt request and accept with the wallet
      cy.get(tid("kyc-personal-upload-submit")).awaitedClick();
      confirmAccessModal();

      // panel should now be in pending state
      cy.get(tid("kyc-panel-pending"));
      // TODO: Move to a separate test
      // Tests multi jurisdiction
      assertFilteredDeJurisdiction();
    });
  });
});
