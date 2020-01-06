import { createAndLoginNewUser, goOffline, goOnline, goToDashboard, tid } from "../utils";

describe("Offline mode", () => {
  it("should still be possible to use the app after being offline", () => {
    createAndLoginNewUser({ type: "investor" });

    goToDashboard();

    goOffline();

    cy.get(tid("my-portfolio-widget-error")).should("exist");

    cy.wait(10000);

    cy.get(tid("my-portfolio-widget-error")).should("exist");

    goOnline();

    cy.get(tid("menu-go-to-portfolio")).click();

    cy.go("back");

    cy.get(tid("my-portfolio-widget-incoming-payout-pending")).should("exist");
  });
});
