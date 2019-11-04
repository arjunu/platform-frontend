import {
  accountFixtureAddress,
  addFailedPendingTransactions,
  addPendingExternalTransaction,
  closeModal,
  goToDashboard,
  goToWallet,
  removePendingExternalTransaction,
  tid,
} from "../utils";
import { loginFixtureAccount } from "../utils/userHelpers";
import { assertTxErrorDialogueNoCost } from "./../utils/assertions";
import { addPendingTransactions } from "./../utils/userHelpers";
import { generalPendingTxFixture } from "./generalPendingTxFixture";
import { assertPendingWithdrawModal, assertSuccessWithdrawModal, doWithdraw } from "./utils";

describe("Pending Transactions In Header", () => {
  it("should show no pending transaction icon", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
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

      doWithdraw(address, amount, { closeWhen: "pending" });

      // TODO: this test will be super flaky - with 500 ms block time it will be mined faster
      // than you can close the dialog. you could just mock mining by POSTing transaction to user_api
      // assert correct behavior of transaction monitor
      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(address, amount);

      assertSuccessWithdrawModal(address, amount);

      // after success modal is closed should remove transaction for pending list
      closeModal();
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });

  it("should not remove transaction that's still pending from the list", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "pending" });

      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(address, amount);

      closeModal();

      cy.get(tid("pending-transactions-status.mining")).should("exist");
    });
  });

  it("should not remove transaction from pending list after reload when success modal is opened", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "never" });

      cy.reload();

      cy.get(tid("pending-transactions-status.success")).click();

      assertSuccessWithdrawModal(address, amount);
    });
  });

  it("should open pending transaction monitor when there is a success transaction", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "pending" });

      cy.get(tid("pending-transactions-status.mining")).should("not.exist");

      // when mined should show success modal
      cy.get(tid("pending-transactions-status.success")).click();

      assertSuccessWithdrawModal(address, amount);

      // after success modal is closed should remove transaction for pending list
      closeModal();
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });

  it("should test failed tx", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const txHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
      const tx = generalPendingTxFixture;

      addPendingTransactions(tx);

      goToWallet();

      cy.reload();

      cy.get(tid("pending-transactions-status.mining")).should("exist");

      addFailedPendingTransactions(
        accountFixtureAddress("INV_EUR_ICBM_HAS_KYC_SEED"),
        txHash,
        "ERROR MARK",
      );

      cy.get(tid("pending-transactions-status.error"))
        .should("exist")
        .click();

      assertTxErrorDialogueNoCost();
    });
  });

  it("should remove transaction from pending list after success", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const address = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
      const amount = "10";

      doWithdraw(address, amount, { closeWhen: "success" });

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });

  it("external pending transaction should not affect header icon", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      addPendingExternalTransaction(accountFixtureAddress("INV_EUR_ICBM_HAS_KYC_SEED"));

      goToDashboard();

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");

      removePendingExternalTransaction();
    });
  });

  // TODO: Add test for tx error case like `should remove transaction from pending list after success`

  // TODO: Add test for tx error case like `should open pending transaction monitor when there is a success transaction`
});
