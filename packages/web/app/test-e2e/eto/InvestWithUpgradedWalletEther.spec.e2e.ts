import { confirmAccessModal, etoFixtureAddressByName } from "../utils";
import { assertButtonIsActive } from "../utils/assertions";
import { goToDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";
import { assertInvestmentModal } from "./utils";

describe("Invest with eth token", () => {
  it("invest into public sale", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC", {
      kyc: "business",
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      // click invest now button
      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

      assertInvestmentModal();

      // select ether from icbm wallet
      cy.get(tid("investment-type.selector.ICBM_ETH")).check({ force: true });
      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("10");

      // wait for calculation to complete
      assertButtonIsActive("invest-modal-invest-now-button");

      cy.get(tid("invest-modal-invest-now-button")).click();

      cy.get(tid("invest-modal-summary-confirm-button")).click();

      confirmAccessModal();

      cy.get(tid("investment-flow.success.title")).should("exist");
      // TODO check smart contracts balances
    });
  });

  it("should not show non ICBM wallets when it's not allowed by investment", () => {
    const WHITELIST_ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      // verify ETO with disabled ETH wallet
      cy.get(tid(`eto-overview-${WHITELIST_ETO_ID}`)).click();
      // click invest now button
      cy.get(tid(`eto-invest-now-button-${WHITELIST_ETO_ID}`)).click();

      assertInvestmentModal();

      // ETH wallet should be unavailable in this ETO investment
      cy.get(tid("investment-type.selector.ETH")).should("not.exist");

      // close investment modal
      cy.get(tid("modal-close-button")).click();

      goToDashboard();
      // verify ETO with enabled ETH wallet
      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
      // click invest now button
      cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

      assertInvestmentModal();

      // ETH wallet should be unavailable in this ETO investment
      cy.get(tid("investment-type.selector.ETH")).should("exist");
      // it should not have enable wallet button
      cy.get(tid("investment-type.selector.ETH.enable-wallet")).should("not.exist");
    });
  });

  it("should not show non ICBM wallets in presale after calculating contribution and refreshing modal (fixes #3556)", () => {
    const WHITELIST_ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      // verify ETO with disabled ETH wallet
      cy.get(tid(`eto-overview-${WHITELIST_ETO_ID}`)).click();
      // click invest now button
      cy.get(tid(`eto-invest-now-button-${WHITELIST_ETO_ID}`)).click();

      assertInvestmentModal();

      // ETH wallet should be unavailable in this ETO investment
      cy.get(tid("investment-type.selector.ETH")).should("not.exist");

      cy.get(tid("invest-modal-eth-field"))
        .clear()
        .type("1000");

      // wait for calculation to complete
      assertButtonIsActive("invest-modal-invest-now-button");

      // close investment modal
      cy.get(tid("modal-close-button")).click();

      // click invest now again
      cy.get(tid(`eto-invest-now-button-${WHITELIST_ETO_ID}`)).click();

      assertInvestmentModal();

      // ETH wallet should be unavailable in this ETO investment
      cy.get(tid("investment-type.selector.ETH")).should("not.exist");
    });
  });
});
