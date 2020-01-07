import { e2eRoutes } from "../../components/testing/e2eRoutes";
import { tid } from "../utils";

describe("Critical error page", () => {
  it("should exist when component throws during rendering", () => {
    // allow unhandled exceptions
    cy.on("uncaught:exception", () => false);

    cy.visit(e2eRoutes.criticalError);

    cy.get(tid("critical-error-page")).should("exist");
    cy.get(tid("critical-error-page-error-detail")).contains("Test Critical Error");

    cy.screenshot();
  });
});
