import { appRoutes } from "../../components/appRoutes";
import { kycRoutes } from "../../components/kyc/routes";
import { ID_NOW_EXTERNAL_MOCK } from "../config";
import { fillForm, uploadMultipleFilesToFieldWithTid } from "../utils/forms";
import { stubWindow } from "../utils/index";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { kycInvidualForm, kycInvidualFormUS } from "./fixtures";

const goToKycIndividualFlow = () => {
  // go to kyc select and then individual page
  cy.visit(kycRoutes.start);

  cy.get(tid("kyc-start-go-to-personal")).click();
  cy.url().should("contain", kycRoutes.individualStart);
};

const assertOutsourcedVerification = () => {
  stubWindow("windowOpen");

  cy.get(tid("kyc-go-to-outsourced-verification")).click();

  cy.get("@windowOpen").should("be.calledWithMatch", ID_NOW_EXTERNAL_MOCK, "_blank");

  cy.get(tid("kyc-panel-outsourced")).should("exist");
};

const assertOutsourcedKycWidgetStatus = () => {
  cy.visit(appRoutes.profile);

  stubWindow("windowOpen");

  cy.get(tid("settings.kyc-status-widget.continue-kyc-idnow-verification")).click();

  cy.get("@windowOpen").should("be.calledWithMatch", ID_NOW_EXTERNAL_MOCK, "_blank");
};

describe("KYC Personal flow with ID Now", () => {
  it("should go through ID Now", () => {
    createAndLoginNewUser({ type: "investor" });

    goToKycIndividualFlow();

    // fill and submit the form
    fillForm(kycInvidualForm);

    assertOutsourcedVerification();

    assertOutsourcedKycWidgetStatus();
  });

  it("should go through ID Now for US investor", () => {
    createAndLoginNewUser({ type: "investor" });

    goToKycIndividualFlow();

    fillForm(kycInvidualFormUS, { submit: false });

    // Upload accreditation documents
    uploadMultipleFilesToFieldWithTid("kyc-personal-accreditation-upload-dropzone", [
      "example.jpg",
    ]);

    cy.get(tid("kyc-personal-start-submit-form")).click();

    assertOutsourcedVerification();

    assertOutsourcedKycWidgetStatus();
  });
});
