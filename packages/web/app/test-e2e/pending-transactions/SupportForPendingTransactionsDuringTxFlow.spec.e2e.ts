import {
  accountFixtureAddress,
  addPendingExternalTransaction,
  goToWallet,
  removePendingExternalTransaction,
  tid,
} from "../utils";
import { assertTxErrorDialogueNoCost } from "../utils/assertions";
import {
  addFailedPendingTransactions,
  addPendingTransactions,
  clearPendingTransactions,
  loginFixtureAccount,
} from "../utils/userHelpers";
import { generalPendingTxFixture, mismatchedPendingTxFixture } from "./generalPendingTxFixture";
import { assertDraftWithdrawModal, assertPendingWithdrawModal } from "./utils";

describe("Pending Transactions During TX flow", () => {
  it("external pending transaction should block transaction flow", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      addPendingExternalTransaction(accountFixtureAddress("INV_EUR_ICBM_HAS_KYC_SEED"));

      goToWallet();

      cy.get(tid("wallet.eth.withdraw.button")).click();

      cy.get(tid("modals.shared.tx-external-pending.modal")).should("exist");

      // Unfortunately it's not possible to assert
      // whether transaction flow was unblocked after external transaction is done

      removePendingExternalTransaction();
    });
  });

  it("platform pending transaction should block transaction flow", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const tx = generalPendingTxFixture;

      addPendingTransactions(tx);

      goToWallet();

      cy.get(tid("wallet.eth.withdraw.button")).click();

      assertPendingWithdrawModal("0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988", "1");

      // It's not possible to that transaction will move to success/error state as
      // this is a mock transaction that doesn't exist on a blockchain

      clearPendingTransactions();
    });
  });

  it("platform pending transaction should show cancelled transaction when transactional node fails", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const tx = generalPendingTxFixture;

      addPendingTransactions(tx);

      goToWallet();

      cy.get(tid("wallet.eth.withdraw.button")).click();

      assertPendingWithdrawModal("0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988", "1");

      addFailedPendingTransactions(
        accountFixtureAddress("INV_EUR_ICBM_HAS_KYC_SEED"),
        tx.transaction.hash,
        "ERROR MARK",
      );

      assertTxErrorDialogueNoCost();
    });
  });

  it("platform pending transaction should delete Pending Transaction with version mismatch", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      const tx = mismatchedPendingTxFixture;

      addPendingTransactions(tx);

      goToWallet();

      cy.get(tid("wallet.eth.withdraw.button")).click();

      assertDraftWithdrawModal();
    });
  });
});
