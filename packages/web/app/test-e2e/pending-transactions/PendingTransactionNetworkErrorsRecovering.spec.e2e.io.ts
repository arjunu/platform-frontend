import { goOffline, goOnline, loginFixtureAccount, tid } from "../utils";
import { assertPendingWithdrawModal, assertSuccessWithdrawModal, doWithdraw } from "./utils";

describe("Pending transaction network errors recovering", () => {
  it("should recover pending transaction watcher opened from header", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED").then(() => {
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

  it("should still watch for a pending transaction after being offline for a while", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED").then(() => {
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
