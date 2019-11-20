import BigNumber from "bignumber.js";
import Web3Accounts from "web3-eth-accounts";

import { appRoutes } from "../../components/appRoutes";
import { Q18 } from "../../config/constants";
import { NODE_ADDRESS } from "../config";
import {
  accountFixtureAddress,
  accountFixturePrivateKey,
  charRegExPattern,
  FIXTURE_ACCOUNTS,
  letterKeepDotRegExPattern,
  letterRegExPattern,
} from "../utils";
import { cyPromise } from "../utils/cyPromise";
import { assertWaitForTransactionSuccess, sendRawTransactionRpc } from "../utils/ethRpcUtils";
import { goToProfile } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser, loginFixtureAccount } from "../utils/userHelpers";

//this constant is hard coded!
const FIXTURE_DIV_CONSTANT = 100000000000000;

describe("Wallet Migration Flow", () => {
  it("It should check icbm migration wallet when user has locked wallet", () => {
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC", {
      kyc: "business",
    }).then(() => {
      cy.visit(appRoutes.icbmMigration);
      cy.get(tid("models.profile.icbm-wallet-widget.check-your-icbm-wallet-widget"));
    });
  });

  it("It will migrate an ICBM wallet into a new user", () => {
    const INV_ETH_ICBM_NO_KYC_ADDRESS = accountFixtureAddress("INV_ETH_ICBM_NO_KYC");

    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(() => {
      const privKeyHex = accountFixturePrivateKey("INV_ETH_ICBM_NO_KYC");
      const account = new Web3Accounts(NODE_ADDRESS).privateKeyToAccount(privKeyHex);

      goToProfile();

      cy.get(tid("models.profile.icbm-wallet-widget.check-your-icbm-wallet-widget.address"))
        .type(INV_ETH_ICBM_NO_KYC_ADDRESS)
        .type("{enter}");

      // Assert that the values of NEU and ETHER are correct
      cy.get(tid("profile.modal.icbm-wallet-balance.neu-balance")).then(balanceField => {
        const neuBalance = new BigNumber(
          FIXTURE_ACCOUNTS[INV_ETH_ICBM_NO_KYC_ADDRESS].icbmEtherLockBalance[1],
        )
          .div(FIXTURE_DIV_CONSTANT.toString())
          .round(undefined, BigNumber.ROUND_DOWN);

        const ethBalance = new BigNumber(
          FIXTURE_ACCOUNTS[INV_ETH_ICBM_NO_KYC_ADDRESS].icbmEtherLockBalance[0],
        )
          .div(Q18)
          .round(4, BigNumber.ROUND_DOWN);

        cy.get(tid("profile.modal.icbm-wallet-balance.eth-balance")).then(ethData => {
          const walletEthBalance = new BigNumber(
            ethData.text().replace(letterKeepDotRegExPattern, ""),
          );
          const walletNeuBalance = new BigNumber(
            balanceField.text().replace(letterRegExPattern, ""),
          );

          expect(walletNeuBalance.equals(neuBalance)).to.be.true;
          expect(walletEthBalance.equals(ethBalance)).to.be.true;

          // TODO: Refactor callback hell below
          cy.get(tid("modals.icbm-balance-modal.balance-footer.generate-transaction"))
            .wait(2000)
            .click();

          cy.get(tid("modals.icbm-balance-modal.migrate-body.to")).then(toField => {
            const to = toField.text();

            cy.get(tid("modals.icbm-balance-modal.migrate-body.gas-limit")).then(gasLimitField => {
              const gas = gasLimitField.text();

              cy.get(tid("modals.icbm-balance-modal.migrate-body.input-data")).then(
                inputDataField => {
                  const data = inputDataField.text();

                  cyPromise(() =>
                    account.signTransaction({
                      to,
                      value: "0",
                      gas,
                      data,
                      gasPrice: "1",
                    }),
                  ).then((signed: any) => {
                    cy.log("Sending First Transaction");
                    sendRawTransactionRpc(signed.rawTransaction).then(hash => {
                      assertWaitForTransactionSuccess(hash.body.result);

                      cy.get(
                        tid("modals.icbm-balance-modal.balance-footer.successful-transaction"),
                      ).awaitedClick();
                      // Modal Should Detect The transaction and Transition to Step 2
                      cy.get(tid("modals.icbm-balance-modal.migrate-body.step-2"));

                      cy.get(tid("modals.icbm-balance-modal.migrate-body.to")).then(toField2 => {
                        const to2 = toField2.text();

                        cy.get(tid("modals.icbm-balance-modal.migrate-body.gas-limit")).then(
                          gasLimitField2 => {
                            const gas2 = gasLimitField2
                              .text()
                              .replace(charRegExPattern, "")
                              .split("Gaslimit")
                              .pop();

                            cy.get(tid("modals.icbm-balance-modal.migrate-body.input-data")).then(
                              inputDataField2 => {
                                const data2 = inputDataField2.text();

                                cyPromise(() =>
                                  account.signTransaction({
                                    to: to2,
                                    value: "0",
                                    gas: gas2,
                                    data: data2,
                                    gasPrice: "1",
                                  }),
                                ).then((signed2: any) => {
                                  sendRawTransactionRpc(signed2.rawTransaction).then(hash2 => {
                                    assertWaitForTransactionSuccess(hash2.body.result);

                                    // Modal Should Detect The transaction and Transition to success flow
                                    cy.get(
                                      tid(
                                        "modals.icbm-balance-modal.balance-footer.successful-transaction",
                                      ),
                                    );
                                  });
                                });
                              },
                            );
                          },
                        );
                      });
                    });
                  });
                },
              );
            });
          });
        });
      });
    });
  });
});
