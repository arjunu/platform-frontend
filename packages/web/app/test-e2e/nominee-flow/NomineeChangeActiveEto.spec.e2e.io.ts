import {
  accountFixtureAddress,
  getEto,
  goToNomineeDashboard,
  loginFixtureAccount,
  tid,
} from "../utils";

describe("Nominee Change active eto", () => {
  it("should change active ETO for the current tab", () => {
    loginFixtureAccount("NOMINEE_NEUMINI", {
      signTosAgreement: true,
      clearPendingTransactions: true,
    });

    const issuerProspectusApprovedId = accountFixtureAddress("ISSUER_PROSPECTUS_APPROVED");
    goToNomineeDashboard();
    cy.get(tid(`eto-overview-${issuerProspectusApprovedId}`)).should("exist");

    const issuerListedId = accountFixtureAddress("ISSUER_LISTED");
    getEto(issuerListedId).then(eto => {
      goToNomineeDashboard(eto.previewCode);
      cy.get(tid(`eto-overview-${issuerListedId}`)).should("exist");
    });
  });
});
