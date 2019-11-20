import { assertWallet, clearEmailServer, goToProfile, goToWallet } from "../utils";
import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser, loginFixtureAccount } from "../utils/userHelpers";
import { assertBankAccountDetails } from "./assertions";

function assertBankTransferFlow({
  agreementApprovalRequired,
}: {
  agreementApprovalRequired: boolean;
}): void {
  if (agreementApprovalRequired) {
    fillForm({
      quintessenceTosApproved: {
        type: "checkbox",
        values: { false: true },
      },
      nEurTosApproved: {
        type: "checkbox",
        values: { false: true },
      },
      "bank-verification.agree-with-tos": {
        type: "submit",
      },
    });
  }

  cy.get(tid("bank-transfer.purchase.summary.min-amount")).contains("1 EUR");
  cy.get(tid("bank-transfer.purchase.summary.recipient")).contains("Quintessence AG");
  cy.get(tid("bank-transfer.purchase.summary.iban")).contains("LI78088110102905K002E");
  cy.get(tid("bank-transfer.purchase.summary.bic")).contains("BFRILI22XXX");

  cy.get(tid("bank-transfer.purchase.summary.reference-number"))
    .then($e => $e.text().trim())
    .as("referenceNumber")
    .should("match", /NR[\w\d]{10}NR/);

  cy.get(tid("bank-transfer.purchase.summary.transfer-completed")).click();

  // TODO: Email are not send immediately after moving backend to use queues
  // cy.get<string>("@referenceNumber").then(assertWaitForBankTransferSummary);

  cy.get(tid("bank-transfer.purchase.success.go-to-wallet")).click();

  assertWallet();
}

describe("Purchase", () => {
  beforeEach(() => {
    clearEmailServer();
  });
  it("should start purchase agreement approval when bank account not verified", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
      kyc: "business",
      signTosAgreement: true,
    }).then(() => {
      goToWallet();

      cy.get(tid("wallet-balance.neur.purchase-button")).click();

      assertBankTransferFlow({
        agreementApprovalRequired: true,
      });
    });
  });

  it("should start purchase without agreement approval when bank account is verified", () => {
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC_DUP", {
      kyc: "business",
      clearPendingTransactions: true,
    }).then(() => {
      goToWallet();

      cy.get(tid("wallet-balance.neur.purchase-button")).click();

      assertBankTransferFlow({
        agreementApprovalRequired: false,
      });
    });
  });

  it("should show bank account details", () => {
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC_DUP", {
      kyc: "business",
      clearPendingTransactions: true,
    }).then(() => {
      // On wallet
      goToWallet();

      assertBankAccountDetails();

      // On profile
      goToProfile();

      assertBankAccountDetails();
    });
  });

  it("should disable all action buttons related to bank transfer when not verified", () => {
    createAndLoginNewUser({
      type: "investor",
    }).then(() => {
      goToWallet();
      cy.get(tid("wallet-balance.neur.purchase-button")).should("be.disabled");
    });
  });
});
