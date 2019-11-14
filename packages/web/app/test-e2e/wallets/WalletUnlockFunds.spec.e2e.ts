import { closeModal, confirmAccessModal } from "../utils";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Unlock Ether Funds", () => {
  it.skip("do", () => {
    //Can't enable without a new fixture
    loginFixtureAccount("", {
      kyc: "business",
      clearPendingTransactions: true,
    }).then(() => {
      cy.visit("/wallet-unlock-etherlock");
      cy.get(
        tid("modals.tx-sender.withdraw-flow.summery.unlock-funds-summary.accept"),
      ).awaitedClick();
      confirmAccessModal();
      cy.get(tid("modals.shared.signing-message.modal"));
      cy.get(tid("modals.shared.tx-success.modal"));
      closeModal();
      // TODO: fix it! you are not in wallet view and you are checking euro wallet
      cy.get(tid("lockedEuroWallet.balance-values-large-value")).should("not.exist");
    });
  });
});
