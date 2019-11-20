import { convertToUlps } from "../../utils/NumberUtils";
import {
  etoFixtureAddressByName,
  goToPortfolio,
  goToPortfolioWithRequiredPayoutAmountSet,
  tid,
} from "../utils";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Portfolio", () => {
  describe("Reserved assets", () => {
    it("should populate on initial view", () => {
      const etoId = etoFixtureAddressByName("ETOInPayoutState");

      loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP", {
        kyc: "business",
        clearPendingTransactions: true,
      });

      goToPortfolio();

      cy.get(tid(`portfolio-my-assets-token-${etoId}`)).should("exist");
    });
  });

  describe("Asset portfolio", () => {
    it("should hide ETH in pending payouts", () => {
      loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP_2", {
        kyc: "business",
        clearPendingTransactions: true,
      });

      goToPortfolioWithRequiredPayoutAmountSet(convertToUlps("5"));

      cy.get(tid(`asset-portfolio.payout-eth`)).should("not.exist");
      cy.get(tid(`asset-portfolio.payout-eur_t`)).should("exist");
    });

    it("should hide all pending payouts", () => {
      loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP_2", {
        kyc: "business",
        clearPendingTransactions: true,
      });

      goToPortfolioWithRequiredPayoutAmountSet(convertToUlps("5000"));

      cy.get(tid(`asset-portfolio.no-payouts`)).should("exist");
    });
  });

  describe("PastInvestments", () => {
    it("should populate on initial view", () => {
      loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP_2", {
        kyc: "business",
        clearPendingTransactions: true,
      });

      goToPortfolio();

      const etoId = etoFixtureAddressByName("ETOInPayoutState");

      cy.get(tid(`past-investments-${etoId}`)).should("exist");
    });
  });
});
