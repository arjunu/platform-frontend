import BigNumber from "bignumber.js";

import { etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import {
  confirmAccessModal,
  etoFixtureAddressByName,
  getLockedWalletEthAmount,
  parseAmount,
  tid,
} from "../utils";
import { getWalletEthAmount, getWalletNEurAmount } from "../utils/index";
import { loginFixtureAccount } from "../utils/userHelpers";

const startRefundFlow = (etoID: string, hasEth: boolean, hasNEur: boolean) => {
  cy.visit(etoPublicViewByIdLinkLegacy(etoID));

  cy.get(tid("eto-overview-claim-your-refund")).click();

  // assert flow modal
  cy.get(tid("modals.tx-sender.user-refund-flow")).should("exist");

  if (hasEth) {
    cy.get(tid("modals.tx-sender.user-refund-flow.amount.eth"))
      .then($element => parseAmount($element.text()))
      .as("refundAmountEth");
  }

  if (hasNEur) {
    cy.get(tid("modals.tx-sender.user-refund-flow.amount.neur"))
      .then($element => parseAmount($element.text()))
      .as("refundAmountNEur");
  }

  cy.get(tid("modals.tx-sender.user-refund-flow.summary.accept")).click();

  confirmAccessModal();

  cy.get(tid("modals.shared.tx-success.modal"));
  cy.get(tid("modals.shared.tx-action.go-to-wallet")).click();
};

const assertRefundAmount = (
  refundValueSelector: string,
  previousBalanceSelector: string,
  currentBalanceGetter: Cypress.Chainable<BigNumber>,
) => {
  cy.get<BigNumber>(refundValueSelector).then(amount => {
    cy.get<BigNumber>(previousBalanceSelector).then(balanceBefore => {
      currentBalanceGetter.then(balanceAfter => {
        // balance after refund should be increased by the refund amount
        // there can be rounding issue so we assert balance with small delta
        expect(balanceAfter.minus(balanceBefore.plus(amount))).to.be.bignumber.lessThan(0.01);
      });
    });
  });
};

const assertRefundClaimed = (etoID: string) => {
  cy.visit(etoPublicViewByIdLinkLegacy(etoID));

  cy.get(tid("eto-overview-refund-claimed")).should("exist");
};

describe("Refund", () => {
  it("Refund from ETO Page with ICBM wallet investment (only ETH)", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInRefundState");

    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP", {
      kyc: "business",
      clearPendingTransactions: true,
    });

    getLockedWalletEthAmount().as("currentAmountEth");

    startRefundFlow(ETO_ID, true, false);

    assertRefundAmount("@refundAmountEth", "@currentAmountEth", getLockedWalletEthAmount());

    assertRefundClaimed(ETO_ID);
  });

  it("Refund from ETO Page with wallet investment (nEUR and ETH)", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInRefundState");

    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      kyc: "business",
      clearPendingTransactions: true,
    });

    getWalletEthAmount().as("currentAmountEth");
    getWalletNEurAmount(false).as("currentAmountNEur");

    startRefundFlow(ETO_ID, true, true);

    assertRefundAmount("@refundAmountEth", "@currentAmountEth", getWalletEthAmount(false));
    assertRefundAmount("@refundAmountNEur", "@currentAmountNEur", getWalletNEurAmount(false));

    assertRefundClaimed(ETO_ID);
  });
});
