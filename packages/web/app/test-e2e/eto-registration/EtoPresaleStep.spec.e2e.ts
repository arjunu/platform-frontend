import { goToIssuerDashboard, loginFixtureAccount, tid } from "../utils";
import { assertPresaleStep } from "./EtoRegistrationUtils";

describe("Eto presale state", () => {
  it("should show bookbuilding stats", () => {
    loginFixtureAccount("ISSUER_WHITELIST", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    });

    goToIssuerDashboard();

    assertPresaleStep();

    cy.get(tid("bookbuilding-widget.closed")).should("exist");

    cy.get(tid("settings.fundraising-statistics")).should("exist");
    cy.get(tid("settings.presale-counter")).should("exist");

    cy.get(tid("bookbuilding-widget.stats.amount-backed")).contains("500 000 EUR");
    cy.get(tid("bookbuilding-widget.stats.number-of-pledges"))
      // 5 slots filled
      .contains(/\b5\b/)
      //out of 500
      .contains(/\b500\b/);

    cy.get(tid("bookbuilding-widget.stats.download")).should("exist");
  });
});
