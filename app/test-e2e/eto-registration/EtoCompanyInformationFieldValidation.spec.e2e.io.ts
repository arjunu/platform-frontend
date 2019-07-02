import { pick } from "lodash/fp";

import { etoRegisterRoutes } from "../../components/eto/registration/routes";
import { fillForm, getFieldError } from "../utils/forms";
import { formRichTextField, tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { aboutFormRequired, aboutFormSubmit } from "./fixtures";

describe("Eto Company Information Field Validation", function(): void {
  this.retries(2);

  before(() => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" });
    cy.saveLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  it("should focus first invalid input field", () => {
    cy.visit(etoRegisterRoutes.companyInformation);
    cy.get(tid("eto.form.company-information")).should("exist");

    fillForm({
      ...aboutFormSubmit,
    });

    cy.focused().should("have.attr", "name", "brandName");
  });

  it("should focus first invalid textarea field", () => {
    cy.visit(etoRegisterRoutes.companyInformation);
    cy.get(tid("eto.form.company-information")).should("exist");

    const requiredInputFields = pick(
      ["brandName", "companyWebsite", "companyOneliner", "companyDescription"],
      aboutFormRequired,
    );

    fillForm({
      ...requiredInputFields,
      ...aboutFormSubmit,
    });

    cy.focused().should("have.attr", "name", "keyQuoteFounder");
  });

  it("should focus first invalid rich text field", () => {
    cy.visit(etoRegisterRoutes.companyInformation);
    cy.get(tid("eto.form.company-information")).should("exist");

    const requiredInputFields = pick(
      ["brandName", "companyWebsite", "companyOneliner"],
      aboutFormRequired,
    );

    fillForm({
      ...requiredInputFields,
      ...aboutFormSubmit,
    });

    cy.focused().should("match", formRichTextField("companyDescription"));
  });

  it("should correctly validate required fields", () => {
    cy.visit(etoRegisterRoutes.companyInformation);
    cy.get(tid("eto.form.company-information")).should("exist");

    const requiredFields = Object.keys(aboutFormRequired);

    requiredFields.forEach(key => {
      getFieldError(tid("eto.form.company-information"), key).then(
        error => expect(error).to.be.empty,
      );
    });

    fillForm({
      ...aboutFormSubmit,
    });

    requiredFields.forEach(key => {
      getFieldError(tid("eto.form.company-information"), key).then(error =>
        expect(error).to.equal("This field is required"),
      );
    });
  });
});
