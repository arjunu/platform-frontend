import { goToProfile, goToWallet, loginFixtureAccount, tid } from "../utils";

describe("NEUR US States restrictions", () => {
  it("should not allow to use neur in case user is from US, Alabama", () => {
    loginFixtureAccount("demoinvestor10").then(() => {
      // assert on wallet

      goToWallet();

      cy.get(tid("wallet-balance.neur.restricted-us-state")).should("exist");

      cy.get(tid("wallet-balance.neur.purchase-button")).should("be.disabled");
      cy.get(tid("wallet-balance.neur.redeem-button")).should("be.disabled");

      // assert on profile

      goToProfile();

      cy.get(tid("linked-bank-account-widget")).should("not.exist");
    });
  });

  // TODO: Skipped for now as NEUR is hidden for all US investors due to legal
  it.skip("should allow to use neur in case user is from US, California", () => {
    loginFixtureAccount("demoinvestor3").then(() => {
      // assert on wallet

      goToWallet();

      cy.get(tid("wallet-balance.neur.restricted-us-state")).should("not.exist");

      cy.get(tid("wallet-balance.neur.purchase-button")).should("be.enabled");
      cy.get(tid("wallet-balance.neur.redeem-button")).should("be.enabled");

      // assert on profile

      goToProfile();

      cy.get(tid("linked-bank-account-widget")).should("exist");
    });
  });
});
