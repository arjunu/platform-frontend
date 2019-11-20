import BigNumber from "bignumber.js";

import { stripNumberFormatting } from "../../components/shared/formatters/utils";
import { fillForm } from "../utils/forms";
import {
  assertWallet,
  confirmAccessModal,
  getWalletNEurAmount,
  goToWallet,
  parseAmount,
} from "../utils/index";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";
import { assertBankAccountDetails } from "./assertions";

describe("Redeem NEUR", function(): void {
  this.retries(2);
  beforeEach(() => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      kyc: "business",
    }).then(() => {
      // store actual balance
      getWalletNEurAmount().as("currentAmount");

      assertWallet();

      // check if bank account is linked
      assertBankAccountDetails();

      // start redeem flow
      cy.get(tid("wallet-balance.neur.redeem-button")).click();
    });
  });

  it("should withdraw whole balance", () => {
    // click redeem whole balance button
    cy.get(tid("bank-transfer.reedem-init.redeem-whole-balance")).click();

    fillForm({
      "bank-transfer.reedem-init.continue": { type: "submit" },
    });

    // check if value is the same in summary
    cy.get(tid("bank-transfer.redeem-summary.return-amount")).then($el => {
      const redeemedAmount = parseAmount(stripNumberFormatting($el.text()));

      cy.get<BigNumber>("@currentAmount").then(previousAmount => {
        expect(previousAmount).to.bignumber.bignumber.eq(redeemedAmount);
      });
    });

    // continue transaction
    cy.get(tid("bank-transfer.redeem-summary.continue")).click();
    confirmAccessModal();

    // go to wallet
    cy.get(tid("bank-transfer.redeem.success.go-to-wallet")).click();

    // refresh page instead of waiting to have data updated
    goToWallet();

    // check if balance is 0
    getWalletNEurAmount(false).then(actualAmount => {
      expect(actualAmount).to.bignumber.bignumber.eq(0);
    });
  });
});
