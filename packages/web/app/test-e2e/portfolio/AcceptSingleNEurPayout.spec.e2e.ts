import BigNumber from "bignumber.js";

import {
  closeModal,
  confirmAccessModal,
  getWalletNEurAmount,
  goToPortfolio,
  parseAmount,
} from "../utils";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Investor accept payout", () => {
  beforeEach(() => loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC"));
  it("nEUR payout", () => {
    getWalletNEurAmount().as("balanceBefore");

    goToPortfolio();

    cy.get(tid(`asset-portfolio.payout-eur_t`)).within(() => {
      // accept neur payout
      cy.get(tid("asset-portfolio.payout.accept-payout")).click();
    });

    // save neur amount to be claimed
    cy.get(tid("investor-payout.accept-summary.eur_t-total-payout"))
      .then($element => parseAmount($element.text()))
      .as("amountToBeClaimed");

    // accept summary
    cy.get(tid("investor-payout.accept-summary.accept")).click();
    confirmAccessModal();

    // wait for success
    cy.get(tid("investor-payout.accept-success"));
    closeModal();

    // assert that payout is removed from the list
    cy.get(tid(`asset-portfolio.payout-eur_t`)).should("not.exist");

    cy.get<BigNumber>("@amountToBeClaimed").then(amount => {
      cy.get<BigNumber>("@balanceBefore").then(balanceBefore => {
        getWalletNEurAmount().then(balanceAfter => {
          // balance after payout should be increased by the payout amount
          // there can be rounding issue so we assert balance with small delta
          expect(balanceAfter.minus(balanceBefore.plus(amount))).to.be.bignumber.lessThan(0.01);
        });
      });
    });
  });
});
