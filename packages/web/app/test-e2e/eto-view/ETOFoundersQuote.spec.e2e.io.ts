import { goToEtoPreview, loginFixtureAccount, tid } from "../utils";

const assertFoundersQuote = () => {
  goToEtoPreview();
  cy.get(tid("eto-overview-status-founders-quote")).should("exist");
  cy.get(tid("eto.public-view.investor-preview-banner.view-as-investor")).click();
  cy.get(tid("eto-overview-status-founders-quote")).should("exist");
  cy.screenshot();
};

describe("ETO founders quote", () => {
  it("should dispaly founders quote for eto in draft state for both issuer and investor", () => {
    loginFixtureAccount("ISSUER_HAS_KYC_AND_FILLED_COMPANY_DATA");

    assertFoundersQuote();
  });

  it("should dispaly founders quote for eto in campaign state for both issuer and investor", () => {
    loginFixtureAccount("ISSUER_LISTED");

    assertFoundersQuote();
  });

  it("should dispaly founders quote for eto in pending state for both issuer and investor", () => {
    loginFixtureAccount("ISSUER_PENDING");

    assertFoundersQuote();
  });
});
