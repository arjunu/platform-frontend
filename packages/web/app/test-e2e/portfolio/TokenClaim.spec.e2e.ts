import {
  assertPortfolio,
  confirmAccessModal,
  etoFixtureAddressByName,
  fillForm,
  goToPortfolio,
  loginFixtureAccount,
  tid,
} from "../utils";

describe("Token claim", () => {
  it("claimed token should show in My Assets table", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPayoutState");

    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      kyc: "business",
      clearPendingTransactions: true,
    });

    goToPortfolio();

    cy.get(tid(`modals.portfolio.portfolio-asset-action.claim-${ETO_ID}`)).click();

    fillForm(
      {
        readDocuments: {
          type: "toggle",
          checked: true,
        },
      },
      { submit: false },
    );

    cy.get(tid("modals.tx-sender.user-claim-flow.summary.accept")).click();

    confirmAccessModal();

    cy.get(tid("modals.tx-sender.user-claim-flow.success")).should("exist");
    cy.get(tid("modals.tx-sender.user-claim-flow.success.go-to-portfolio")).click();

    assertPortfolio();

    cy.get(tid(`portfolio-reserved-asset-${ETO_ID}`)).should("not.exist");
    cy.get(tid(`portfolio-my-assets-token-${ETO_ID}`)).should("exist");
    cy.get(tid(`past-investments-${ETO_ID}`)).should("exist");
  });
});
