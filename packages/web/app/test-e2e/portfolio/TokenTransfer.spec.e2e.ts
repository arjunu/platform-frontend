import { confirmAccessModal } from "../utils";
import { fillForm } from "../utils/forms";
import { tid } from "../utils/selectors";
import { DEFAULT_PASSWORD, loginFixtureAccount } from "../utils/userHelpers";
import { getTokenBalance } from "./../utils/ethRpcUtils";
import { etoFixtureAddressByName } from "./../utils/index";
import { goToPortfolio } from "./../utils/navigation";
import { assertWithdrawButtonIsDisabled, typeWithdrawForm } from "./../wallets/utils";

export const NeumarkContract: any = require("../../../../../git_modules/platform-contracts-artifacts/localhost/contracts/Neumark.json");

const continueTokenFlow = (etoId: string, uniqueFlowSteps: () => void) => {
  cy.get(tid(`modals.portfolio.portfolio-assets.send-token-${etoId}`)).click();
  uniqueFlowSteps();
  assertWithdrawButtonIsDisabled();
  cy.get(tid("modals.tx-sender.withdraw-flow.withdraw-component.new-address-with-balance")).should(
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

  cy.get(tid("modals.tx-sender.withdraw-flow.summary.accept")).awaitedClick();

  confirmAccessModal(DEFAULT_PASSWORD);

  cy.get(tid("modals.shared.signing-message.modal")).should("exist");
  cy.get(tid("modals.shared.tx-success.modal")).should("exist");
};

describe("Token Transfer", () => {
  const testAddress = "0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883";
  const testValue = "5";
  it("should transfer tokens to new wallet", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      signTosAgreement: true,
    }).then(({ address }) => {
      getTokenBalance("0xf4c2ccae6289a23f663e9b10795d1ef6f80d494e", address).then(tokenBalance => {
        const etoId = etoFixtureAddressByName("ETOInClaimState");

        goToPortfolio();

        continueTokenFlow(etoId, () => {
          typeWithdrawForm(testAddress, testValue);
        });

        getTokenBalance("0xf4c2ccae6289a23f663e9b10795d1ef6f80d494e", address).then(balance2 => {
          const transferedAmount = tokenBalance.sub(balance2).toString();
          expect(transferedAmount).to.be.equal(testValue);
        });
      });
    });
  });
  it("should transfer all tokens to new wallet", () => {
    loginFixtureAccount("INV_HAS_EUR_HAS_KYC", {
      signTosAgreement: true,
    }).then(({ address }) => {
      const zeroAmount = "0";
      const etoId = etoFixtureAddressByName("ETOInClaimState");

      goToPortfolio();
      continueTokenFlow(etoId, () => {
        typeWithdrawForm(testAddress, testValue);
        cy.get(tid("modals.tx-sender.transfer-flow.transfer-component.whole-balance")).click();
      });
      getTokenBalance("0xf4c2ccae6289a23f663e9b10795d1ef6f80d494e", address).then(balance => {
        expect(balance.toString()).to.be.equal(zeroAmount);
      });
    });
  });
});
