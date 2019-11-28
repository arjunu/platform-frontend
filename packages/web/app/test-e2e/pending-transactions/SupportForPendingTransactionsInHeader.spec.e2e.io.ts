import BigNumber from "bignumber.js";

import {
  addFailedPendingTransactions,
  addPendingExternalTransaction,
  closeModal,
  goToDashboard,
  goToWallet,
  removePendingExternalTransaction,
  tid,
} from "../utils";
import { assertTxErrorDialogueNoCost } from "../utils/assertions";
import { addPendingTransactions, clearPendingTransactions } from "../utils/userHelpers";
import { Q18 } from "./../../config/constants";
import { ETxSenderState } from "./../../modules/tx/sender/reducer";
import { sendEth } from "./../utils/ethRpcUtils";
import { createAndLoginNewUser } from "./../utils/userHelpers";
import { generalPendingTxFixture } from "./generalPendingTxFixture";
import { assertPendingWithdrawModal, doWithdraw } from "./utils";

describe("Pending Transactions In Header", () => {
  let userAddress: string;
  const testAddress = "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988";
  const amount = "1";
  before(() => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
      clearPendingTransactions: true,
      signTosAgreement: true,
    }).then(({ address }) => {
      cy.saveLocalStorage();
      userAddress = address;
      sendEth("DEPLOYER", address, Q18.mul(amount));
    });
  });
  beforeEach(() => {
    cy.restoreLocalStorage();
    goToWallet();
  });
  describe("Tests that Mock the Pending Transactions", () => {
    it("should show no pending transaction icon", () => {
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });

    it("should open pending transaction monitor when there is a pending transaction and Keep pending", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress));

      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(testAddress, amount);
    });

    it("should not remove transaction that's still pending from the list", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress));

      cy.get(tid("pending-transactions-status.mining")).click();

      assertPendingWithdrawModal(testAddress, amount);

      closeModal();

      cy.get(tid("pending-transactions-status.mining")).should("exist");
    });

    it("should not remove transaction from pending list after reload when success modal is opened", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress, ETxSenderState.DONE));
      cy.get(tid("pending-transactions-status.success")).click();

      cy.reload();

      cy.get(tid("pending-transactions-status.success")).click();
    });

    it("should open pending transaction monitor when there is a success transaction", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress, ETxSenderState.DONE));

      cy.get(tid("pending-transactions-status.mining")).should("not.exist");

      // when mined should show success modal
      cy.get(tid("pending-transactions-status.success")).click();

      closeModal();
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });

    it("should open pending transaction monitor when there is a failed transaction", () => {
      addPendingTransactions(generalPendingTxFixture(userAddress, ETxSenderState.ERROR_SIGN));

      cy.get(tid("pending-transactions-status.mining")).should("not.exist");

      // when mined should show success modal
      cy.get(tid("pending-transactions-status.error")).click();

      closeModal();
      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });

    it("should test failed tx", () => {
      const txHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
      const tx = generalPendingTxFixture(userAddress);

      addPendingTransactions(tx);

      goToWallet();

      cy.reload();

      cy.get(tid("pending-transactions-status.mining")).should("exist");

      addFailedPendingTransactions(userAddress, txHash, "ERROR MARK");

      cy.get(tid("pending-transactions-status.error"))
        .should("exist")
        .click();

      assertTxErrorDialogueNoCost();
    });

    it("external pending transaction should not affect header icon", () => {
      clearPendingTransactions();
      addPendingExternalTransaction(userAddress);

      goToDashboard();

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");

      removePendingExternalTransaction();
    });
  });

  describe("Tests that conduct a real transaction", () => {
    it("should remove transaction from pending list after success", () => {
      removePendingExternalTransaction();
      doWithdraw(testAddress, new BigNumber(amount).minus("0.001").toString(), {
        closeWhen: "success",
      });

      cy.get(tid("pending-transactions-status.no-pending-transactions")).should("exist");
    });
  });
  // TODO: Add test for tx error case like `should open pending transaction monitor when there is a success transaction`
});
