import { assertLanding } from "../utils/assertions";

describe("Landing", () => {
  it("should should landing page", () => {
    cy.visit("/");

    assertLanding();

    cy.screenshot();
  });
});
