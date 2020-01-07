import BigNumber from "bignumber.js";

import {
  closeModal,
  confirmAccessModal,
  getWalletEthAmount,
  getWalletNEurAmount,
  goToPortfolio,
  parseAmount,
} from "../utils";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

it("should correctly accept all payouts", () => {
  loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP");
  getWalletEthAmount().as("balanceEthBefore");
  getWalletNEurAmount().as("balanceNEurBefore");

  goToPortfolio();

  // accept all payouts
  cy.get(tid("asset-portfolio.payout.accept-all-payouts")).click();

  // save amounts to be claimed
  cy.get(tid("investor-payout.accept-summary.eth-total-payout"))
    .then($element => parseAmount($element.text()))
    .as("ethAmountToBeClaimed");

  cy.get(tid("investor-payout.accept-summary.eur_t-total-payout"))
    .then($element => parseAmount($element.text()))
    .as("nEurAmountToBeClaimed");

  // accept summary
  cy.get(tid("investor-payout.accept-summary.accept")).click();
  confirmAccessModal();

  // wait for success
  cy.get(tid("investor-payout.accept-success"));
  closeModal();

  // assert that payout is removed from the list
  cy.get(tid(`asset-portfolio.payout-eth`)).should("not.exist");
  cy.get(tid(`asset-portfolio.payout-eur_t`)).should("not.exist");

  cy.get<BigNumber>("@ethAmountToBeClaimed").then(amount => {
    cy.get<BigNumber>("@balanceEthBefore").then(balanceBefore => {
      getWalletEthAmount().then(balanceAfter => {
        // balance after payout should be increased by the payout amount
        // there can be rounding issue and gas price cost so we assert balance with small delta
        expect(balanceAfter.minus(balanceBefore.plus(amount))).to.be.bignumber.lessThan(0.01);
      });
    });
  });

  cy.get<BigNumber>("@nEurAmountToBeClaimed").then(amount => {
    cy.get<BigNumber>("@balanceNEurBefore").then(balanceBefore => {
      getWalletNEurAmount().then(balanceAfter => {
        // balance after payout should be increased by the payout amount
        // there can be rounding issue so we assert balance with small delta
        expect(balanceAfter.minus(balanceBefore.plus(amount))).to.be.bignumber.lessThan(0.01);
      });
    });
  });
});
