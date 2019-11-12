import { etoFixtureAddressByName, loginFixtureAccount, tid } from "../utils";
import { startInvestmentFlow } from "./utils";

describe("Investment modal token price", () => {
  it("should show correct token price without discount", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC", {
      kyc: "business",
      clearPendingTransactions: true,
    });

    startInvestmentFlow(PUBLIC_ETO_ID);

    cy.get(tid("investment-flow.token-price.no-discount.price")).contains("0.6000 EUR");

    cy.get(tid("investment-type.selector.ICBM_NEUR")).check({ force: true });
    cy.get(tid("invest-modal-eur-field"))
      .clear()
      .type("10");

    cy.get(tid("invest-modal.est-equity-tokens")).contains("16 BLKK");
  });

  it("should show correct token price with personal and whitelist discount", () => {
    const PRESALE_ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC", {
      kyc: "business",
      clearPendingTransactions: true,
    });

    startInvestmentFlow(PRESALE_ETO_ID);

    cy.get(tid("investment-flow.token-price.personal-discount.amount-left")).contains(
      "500 000 EUR",
    );
    cy.get(tid("investment-flow.token-price.personal-discount.price")).contains("0.2118 EUR");
    cy.get(tid("investment-flow.token-price.personal-discount.discount")).contains("50%");
    cy.get(tid("investment-flow.token-price.personal-discount.general-discount.price")).contains(
      "0.2966 EUR",
    );
    cy.get(tid("investment-flow.token-price.personal-discount.general-discount.discount")).contains(
      "30%",
    );
  });

  it("should show correct token price with whitelist discount", () => {
    const PRESALE_ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      kyc: "business",
      clearPendingTransactions: true,
    });

    startInvestmentFlow(PRESALE_ETO_ID);

    cy.get(tid("investment-flow.token-price.whitelist-discount.price")).contains("0.2966 EUR");
    cy.get(tid("investment-flow.token-price.whitelist-discount.discount")).contains("30%");

    cy.get(tid("investment-type.selector.NEUR")).check({ force: true });
    cy.get(tid("invest-modal-eur-field"))
      .clear()
      .type("10");

    cy.get(tid("invest-modal.est-equity-tokens")).contains("33 RCH");
  });
});
