import Web3Accounts from "web3-eth-accounts";

import { Q18 } from "../../config/constants";
import { accountFixtureByName, confirmAccessModal, goToDashboard, parseAmount } from "../utils";
import { sendEth } from "../utils/ethRpcUtils";
import { fillForm } from "../utils/forms";
import { accountFixtureAddress } from "../utils/index";
import { goToWallet, goToWalletWithParams } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser, DEFAULT_PASSWORD, loginFixtureAccount } from "../utils/userHelpers";
import {
  assertWithdrawButtonIsDisabled,
  assertWithdrawFlow,
  checkTransactionWithRPCNode,
  fillWithdrawForm,
} from "./utils";

export const SimpleExchangeContract: any = require("../../../../../git_modules/platform-contracts-artifacts/localhost/contracts/SimpleExchange.json");
export const EuroTokenContract: any = require("../../../../../git_modules/platform-contracts-artifacts/localhost/contracts/EuroToken.json");

describe("Wallet Withdraw", () => {
  describe("checks only", () => {
    it("should ask if you want to not leave account without gas reserves", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testValue = "5";
        const account = new Web3Accounts().create();
        const testAddress = account.address;

        goToWallet();

        fillWithdrawForm(testAddress, testValue);

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet")).should(
          "not.exist",
        );

        // Should show warning for whole possible balance used
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.whole-balance")).click();

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value"))
          .invoke("val")
          .as("maxValue");

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet")).should(
          "exist",
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).clear();

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet")).should(
          "not.exist",
        );

        // Should show warning for slightly lower value than whole balance
        cy.get<string>("@maxValue").then(v => {
          const value = parseAmount(v);
          cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type(
            value.toString(),
          );
        });

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.will-empty-wallet")).should(
          "exist",
        );

        assertWithdrawButtonIsDisabled();
      });
    });

    it("it should not break when address is not provided first", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testValue = "5";
        const account = new Web3Accounts().create();
        const testAddress = account.address;

        goToWallet();

        cy.get(tid("wallet.eth.withdraw.button")).awaitedClick();

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type(
          testValue.toString(),
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).type(
          testAddress,
        );

        fillForm(
          {
            allowNewAddress: {
              type: "checkbox",
              values: { false: true },
            },
          },
          { submit: false },
        );

        cy.get(
          tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"),
        ).should("be.enabled");
      });
    });

    it("should not allow to withdraw to smart contract not accepting ether", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testAddress = EuroTokenContract.networks["17"].address;
        const testValue = "5";

        goToWallet();
        fillWithdrawForm(testAddress, testValue);

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.not-accepting-ether")).should(
          "exist",
        );
        assertWithdrawButtonIsDisabled();
      });
    });

    it("should not allow to withdraw to smart contract not accepting ether when user has no ETH-T", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testAddress = EuroTokenContract.networks["17"].address;
        const testValue = "5";

        goToWallet();

        cy.get(tid("wallet.eth.withdraw.button")).awaitedClick();
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.to-address")).type(
          testAddress,
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.value")).type(
          testValue.toString(),
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.not-accepting-ether")).should(
          "exist",
        );
        assertWithdrawButtonIsDisabled();
      });
    });

    it("should allow to withdraw all for specific available amount", () => {
      // Use INV_EUR_ICBM_HAS_KYC which is confirmed case of broken calculation
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testValue = "5";
        const testAddress = accountFixtureAddress("ISSUER_BLANK_QA_HAS_KYC");

        goToWallet();

        fillWithdrawForm(testAddress, testValue);

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address")).should(
          "not.exist",
        );
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.verified-user")).should(
          "exist",
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.whole-balance")).click();

        fillForm(
          {
            withdrawAll: {
              type: "checkbox",
              values: { false: true },
            },
          },
          { submit: false },
        );

        cy.get(
          tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"),
        ).should("be.enabled");
      });
    });
  });

  describe("actual withdraw", () => {
    it("should withdraw to new wallet", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testValue = "5";
        const account = new Web3Accounts().create();
        const testAddress = account.address;

        const expectedInput = `0x64663ea6000000000000000000000000${testAddress
          .slice(2)
          .toLowerCase()}0000000000000000000000000000000000000000000000004563918244f40000`;

        goToWallet();

        fillWithdrawForm(testAddress, testValue);

        /* Newly created wallet should not have any transactions so we have to accept warnings */
        assertWithdrawButtonIsDisabled();
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address")).should(
          "exist",
        );

        fillForm(
          {
            allowNewAddress: {
              type: "checkbox",
              values: { false: true },
            },
          },
          { submit: false },
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        assertWithdrawFlow(testAddress, testValue, expectedInput);
      });
    });

    it("should show warning when withdraw to not used wallet", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testValue = "5";
        const account = new Web3Accounts().create();
        const testAddress = account.address;

        const expectedInput = `0x64663ea6000000000000000000000000${testAddress
          .slice(2)
          .toLowerCase()}0000000000000000000000000000000000000000000000004563918244f40000`;

        goToWallet();
        fillWithdrawForm(testAddress, testValue);

        /* Newly created wallet should not have any transactions so we have to accept warnings */
        assertWithdrawButtonIsDisabled();
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address")).should(
          "exist",
        );

        fillForm(
          {
            allowNewAddress: {
              type: "checkbox",
              values: { false: true },
            },
          },
          { submit: false },
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        assertWithdrawFlow(testAddress, testValue, expectedInput);

        goToWallet();
        fillWithdrawForm(testAddress, testValue);
        cy.get(
          tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address-with-balance"),
        ).should("exist");
      });
    });

    it("should show message when withdraw to verified platform address", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testValue = "5";
        const testAddress = accountFixtureAddress("INV_EUR_ICBM_HAS_KYC_SEED");

        const expectedInput = `0x64663ea6000000000000000000000000${testAddress
          .slice(2)
          .toLowerCase()}0000000000000000000000000000000000000000000000004563918244f40000`;

        goToWallet();
        fillWithdrawForm(testAddress, testValue);

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address")).should(
          "not.exist",
        );
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.verified-user")).should(
          "exist",
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        assertWithdrawFlow(testAddress, testValue, expectedInput);
      });
    });

    it("should allow to withdraw to smart contract accepting ether", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testAddress = SimpleExchangeContract.networks["17"].address;

        const testValue = "5";

        const expectedInput = `0x64663ea6000000000000000000000000${testAddress
          .slice(2)
          .toLowerCase()}0000000000000000000000000000000000000000000000004563918244f40000`;

        goToWallet();
        fillWithdrawForm(testAddress, testValue);

        /* Address is smart contract so we need to accept warnings */
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.smart-contract")).should(
          "exist",
        );
        fillForm(
          {
            allowSmartContract: {
              type: "checkbox",
              values: { false: true },
            },
          },
          { submit: false },
        );
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        /*Test flow*/

        assertWithdrawFlow(testAddress, testValue, expectedInput);
      });
    });

    it("should allow to withdraw to fixture without warnings", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        const testAddress = accountFixtureByName("INV_ICBM_ETH_M_HAS_KYC_DUP").definition.address;
        const testValue = "5";
        const expectedInput = `0x64663ea6000000000000000000000000${testAddress
          .slice(2)
          .toLowerCase()}0000000000000000000000000000000000000000000000004563918244f40000`;

        goToWallet();

        fillWithdrawForm(testAddress, testValue);

        /* Address has transaction so accept should not exist */
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.accept-warnings")).should(
          "not.exist",
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        assertWithdrawFlow(testAddress, testValue, expectedInput);
      });
    });

    it("should withdraw all", () => {
      const account = new Web3Accounts().create();
      const testAddress: string = account.address;
      const correctValue = "2";
      createAndLoginNewUser({ type: "investor" }).then(({ address }) => {
        sendEth("DEPLOYER", address, Q18.mul(correctValue));

        goToWallet();
        fillWithdrawForm(testAddress, "5");

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.whole-balance")).click();

        fillForm(
          {
            allowNewAddress: {
              type: "checkbox",
              values: { false: true },
            },
            withdrawAll: {
              type: "checkbox",
              values: { false: true },
            },
          },
          { submit: false },
        );

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

        confirmAccessModal(DEFAULT_PASSWORD);

        cy.get(tid("modals.shared.signing-message.modal")).should("exist");
        cy.get(tid("modals.tx-sender.withdraw-flow.success")).should("exist");

        cy.get(tid("modals.tx-sender.withdraw-flow.tx-hash")).then(txHashObject => {
          const txHash = txHashObject.attr("data-test-hash")!;

          checkTransactionWithRPCNode(
            { expectedTo: testAddress, writtenValue: correctValue },
            txHash,
            true,
          );
        });
      });
    });
  });

  describe("failed transactions", () => {
    it("should show transaction error with cost for mined transaction", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        goToDashboard();

        const testAddress = EuroTokenContract.networks["17"].address;

        const testValue = "5";

        goToWalletWithParams({
          disableNotAcceptingEtherCheck: true,
        });
        fillWithdrawForm(testAddress, testValue);

        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

        confirmAccessModal(DEFAULT_PASSWORD);

        cy.get(tid("modals.shared.signing-message.modal")).should("exist");
        cy.get(tid("modals.tx-sender.withdraw-flow.error")).should("exist");

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.cost.large-value")).contains(/0\.\d{4}/);
      });
    });

    it("should show transaction error with no cost for not mined transaction", () => {
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        goToDashboard();

        const testValue = "5";

        const account = new Web3Accounts().create();
        const testAddress = account.address;

        goToWalletWithParams({
          forceLowGas: true,
        });
        fillWithdrawForm(testAddress, testValue);

        fillForm(
          {
            allowNewAddress: {
              type: "checkbox",
              values: { false: true },
            },
          },
          { submit: false },
        );
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

        confirmAccessModal(DEFAULT_PASSWORD);

        cy.get(tid("modals.shared.signing-message.modal")).should("exist");
        cy.get(tid("modals.tx-sender.withdraw-flow.error")).should("exist");

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.cost.large-value")).should("not.exist");
      });
    });

    it.skip("should show transaction error with cost for a reverted transaction due to out of gas", () => {
      // Web3 Throws when using light wallet due to gas limit checks done before broadcasting the transaction
      loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
        signTosAgreement: true,
        onlyLogin: true,
      }).then(() => {
        goToDashboard();

        const testValue = "5";

        const testAddress = SimpleExchangeContract.networks["17"].address;

        goToWalletWithParams({
          forceStandardGas: true,
        });
        fillWithdrawForm(testAddress, testValue);

        fillForm(
          {
            allowSmartContract: {
              type: "checkbox",
              values: { false: true },
            },
          },
          { submit: false },
        );
        cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.send-transaction-button"))
          .should("be.enabled")
          .click();

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

        confirmAccessModal(DEFAULT_PASSWORD);

        cy.get(tid("modals.shared.signing-message.modal")).should("exist");
        cy.get(tid("modals.tx-sender.withdraw-flow.error")).should("exist");

        cy.get(tid("modals.tx-sender.withdraw-flow.summary.cost.large-value")).contains(/0\.\d{4}/);
      });
    });
  });
});
