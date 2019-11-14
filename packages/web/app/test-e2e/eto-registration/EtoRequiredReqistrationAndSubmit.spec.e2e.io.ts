import { assertEtoDocuments } from "../utils/assertions";
import { fillForm, TFormFixture, uploadDocumentToFieldWithTid } from "../utils/forms";
import { goToIssuerDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import {
  assertUploadSignedTermsheetStep,
  createAndSetNominee,
  fillAndAssert,
  fillRequiredCompanyInformation,
  openAndCheckValues,
  submitProposal,
} from "./EtoRegistrationUtils";
import {
  etoTermsRequiredForm,
  etoTermsRequiredFormExpectedValues,
  investmentTermsRequiredForm,
  investmentTermsRequiredFormExpectedResult,
  votingRights,
  votingRightsExpectedValues,
} from "./fixtures";

describe("Eto Forms", () => {
  it("should fill required fields and submit eto", function(): void {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(async () => {
      goToIssuerDashboard();

      cy.get(tid("eto-progress-widget-eto-terms")).should("not.exist");

      // Fill marketing data first

      fillRequiredCompanyInformation();

      // Now eto settings should be available
      cy.get(tid("eto-progress-widget-eto-terms")).should("exist");

      // Connect nominee with issuer
      createAndSetNominee();

      // Fill eto settings
      fillAndAssert("eto-progress-widget-investment-terms", investmentTermsRequiredForm);

      fillAndAssert("eto-progress-widget-eto-terms", etoTermsRequiredForm);

      fillAndAssert("eto-progress-widget-voting-right", votingRights);

      // some checks to make sure the values in already saved forms are displayed correctly
      openAndCheckValues(
        "eto-progress-widget-investment-terms",
        investmentTermsRequiredForm,
        investmentTermsRequiredFormExpectedResult,
      );
      openAndCheckValues(
        "eto-progress-widget-eto-terms",
        etoTermsRequiredForm,
        etoTermsRequiredFormExpectedValues,
      );
      openAndCheckValues(
        "eto-progress-widget-voting-right",
        votingRights,
        votingRightsExpectedValues,
      );

      goToIssuerDashboard();
      assertUploadSignedTermsheetStep();

      cy.get(tid("dashboard-upload-termsheet-widget.call-to-action")).awaitedClick();

      assertEtoDocuments();

      const documentsForm: TFormFixture = {
        "form.name.signed_termsheet": {
          value: "example.pdf",
          method: "document",
          type: "custom",
        },
      };

      fillForm(documentsForm, {
        submit: false,
        methods: { document: uploadDocumentToFieldWithTid },
      });

      submitProposal();
    });
  });
});
