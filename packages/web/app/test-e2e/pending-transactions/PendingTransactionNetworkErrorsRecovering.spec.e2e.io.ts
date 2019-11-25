import { goOffline, goOnline, loginFixtureAccount, tid } from "../utils";
import { assertPendingWithdrawModal, assertSuccessWithdrawModal, doWithdraw } from "./utils";

describe("Pending transaction network errors recovering", () => {
  it("should recover pending transaction watcher opened from header", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "pending" });

      goOffline();

      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(address, amount);

      cy.wait(10000);

      assertPendingWithdrawModal(address, amount);

      goOnline();

      assertSuccessWithdrawModal(address, amount);
    });
  });

  it("should open pending transaction monitor when there is a pending transaction", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "never" });

      goOffline();

      assertPendingWithdrawModal(address, amount);

      cy.wait(10000);

      assertPendingWithdrawModal(address, amount);

      goOnline();

      assertSuccessWithdrawModal(address, amount);
    });
  });
});
