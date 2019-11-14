import { assertIssuerDashboard } from "../utils/assertions";
import { fillForm, uploadSingleFileToField } from "../utils/forms";
import { goToEtoPreview } from "../utils/navigation";
import { formField, tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { goToCompanyInformation } from "./EtoRegistrationUtils";
import { aboutFormRequired, aboutFormSubmit } from "./fixtures";

describe("Eto Company Information Rich Text Editor", () => {
  before(() => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  it("should render field as rich-text", () => {
    goToCompanyInformation();

    fillForm(
      {
        ...aboutFormRequired,
      },
      { submit: false },
    );

    cy.get(formField("companyDescription")).clear();
    cy.get(".ck.ck-toolbar > :nth-child(3)").awaitedClick();
    cy.get(formField("companyDescription")).type("This is a bold text{enter}");

    fillForm(aboutFormSubmit);

    assertIssuerDashboard();

    goToEtoPreview();

    cy.get(tid("eto-view-company-description"))
      .get("strong")
      .contains("This is a bold text");
  });

  it("should add aria attributes", () => {
    goToCompanyInformation();

    const companyDescriptionName = "companyDescription";

    cy.get(formField(companyDescriptionName)).then($richTextEditor => {
      expect($richTextEditor).to.have.id(companyDescriptionName);

      expect($richTextEditor).to.have.attr("aria-invalid", "false");
      expect($richTextEditor).to.have.attr("aria-multiline", "true");

      const companyDescriptionLabelId = `${companyDescriptionName}-label`;
      cy.get(`#${companyDescriptionLabelId}`).should("exist");
      expect($richTextEditor).to.have.attr("aria-labeledby", companyDescriptionLabelId);
    });

    // show required error
    cy.get(formField(companyDescriptionName))
      // clear previous content
      .clear()
      .type("Sunt tataes prensionem varius, regius turpises.")
      .clear();
    cy.wait(3000);
    cy.get(formField(companyDescriptionName)).then($richTextEditor => {
      expect($richTextEditor).to.have.attr("aria-invalid", "true");

      const companyDescriptionErrorId = `${companyDescriptionName}-error-message`;
      cy.get(`#${companyDescriptionErrorId}`).should("exist");
      expect($richTextEditor).to.have.attr("aria-describedby", companyDescriptionErrorId);
    });
  });

  it("should allow to add images", () => {
    goToCompanyInformation();

    fillForm(
      {
        ...aboutFormRequired,
      },
      { submit: false },
    );

    cy.get(formField("companyDescription")).clear();

    uploadSingleFileToField("companyDescription", "example.jpg");

    // TODO: check if it's possible to get editor state and block saving until image is properly uploaded
    cy.wait(3000);

    fillForm(aboutFormSubmit);

    assertIssuerDashboard();

    goToEtoPreview();

    cy.get(`${tid("eto-view-company-description")} img`).should($field => {
      expect($field.attr("src")).to.contain("https://documents.neufund.io/");
    });
  });
});
