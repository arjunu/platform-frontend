import { generateRandomEthereumAddress } from "../../modules/web3/utils";
import { doWithdraw } from "../pending-transactions/utils";
import { goToWallet, loginFixtureAccount, tid } from "../utils/index";

describe("TransactionHistory", () => {
  it("should load transaction history", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      kyc: "business",
    });

    goToWallet();

    cy.get(tid("transactions-history-row"))
      .its("length")
      .as("previousLength");

    cy.get(tid("transactions-history-load-more")).awaitedClick();

    cy.get<number>("@previousLength").then(previousLength => {
      cy.get(tid("transactions-history-row")).should("to.have.length.gt", previousLength);
    });
  });

  it("should open transaction history modal", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      kyc: "business",
    });

    goToWallet();

    cy.get(tid("transactions-history-row"))
      .first()
      .awaitedClick();

    cy.get(tid("transaction-history-details-modal")).should("exist");
  });

  it("should watch for new transactions", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", { kyc: "business" });

    // generate withdraw transaction to have new item in tx history list
    const randomAddress: string = generateRandomEthereumAddress();

    doWithdraw(randomAddress, "1", { closeWhen: "pending" }).then(txHash => {
      goToWallet();

      cy.get(tid(`transactions-history-${txHash}`)).should("exist");
    });
  });
});
