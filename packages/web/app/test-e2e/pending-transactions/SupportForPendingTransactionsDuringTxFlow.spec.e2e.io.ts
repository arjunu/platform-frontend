import { Q18 } from "../../config/constants";
import {
  addPendingExternalTransaction,
  goToWallet,
  removePendingExternalTransaction,
  tid,
} from "../utils";
import { assertTxErrorDialogueNoCost } from "../utils/assertions";
import { sendEth } from "../utils/ethRpcUtils";
import {
  addFailedPendingTransactions,
  addPendingTransactions,
  clearPendingTransactions,
  createAndLoginNewUser,
} from "../utils/userHelpers";
import { generalPendingTxFixture, mismatchedPendingTxFixture } from "./generalPendingTxFixture";
import { assertDraftWithdrawModal, assertPendingWithdrawModal } from "./utils";

describe("Pending Transactions During TX flow", () => {
  let userAddress: string;
  before(() => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(({ address }) => {
      cy.saveLocalStorage();
      userAddress = address;
      sendEth("DEPLOYER", address, Q18.mul("2"));
    });
  });
  beforeEach(() => {
    cy.restoreLocalStorage();
    goToWallet();
  });

  it("external pending transaction should block transaction flow", () => {
    addPendingExternalTransaction(userAddress);

    cy.get(tid("wallet.eth.withdraw.button")).click();

    cy.get(tid("modals.shared.tx-external-pending.modal")).should("exist");

    // Unfortunately it's not possible to assert
    // whether transaction flow was unblocked after external transaction is done

    removePendingExternalTransaction();
  });

  it("platform pending transaction should block transaction flow", () => {
    addPendingTransactions(generalPendingTxFixture(userAddress));

    cy.get(tid("wallet.eth.withdraw.button")).click();

    assertPendingWithdrawModal("0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988", "1");

    // It's not possible to that transaction will move to success/error state as
    // this is a mock transaction that doesn't exist on a blockchain
  });
  it("platform pending transaction should show cancelled transaction when transactional node fails", () => {
    const tx = generalPendingTxFixture(userAddress);
    addPendingTransactions(tx);

    cy.get(tid("wallet.eth.withdraw.button")).click();

    assertPendingWithdrawModal("0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988", "1");

    addFailedPendingTransactions(userAddress, tx.transaction.hash, "ERROR MARK");

    assertTxErrorDialogueNoCost();
  });
  it("platform pending transaction should delete Pending Transaction with version mismatch", () => {
    clearPendingTransactions();
    addPendingTransactions(mismatchedPendingTxFixture(userAddress));
    cy.get(tid("wallet.eth.withdraw.button")).click();

    assertDraftWithdrawModal();
  });
});
