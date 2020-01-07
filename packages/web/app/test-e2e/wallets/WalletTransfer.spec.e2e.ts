import { accountFixtureAddress, goToDashboard } from "../utils";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Wallet Transfer", () => {
  it("should generate correct qr-code and address", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_SEED");
    goToDashboard();

    cy.get(tid("authorized-layout-wallet-button")).awaitedClick();

    cy.get(tid("wallet.eth.transfer.button")).awaitedClick();

    cy.fixture("INV_EUR_ICBM_HAS_KYC_ADDRESS.svg", "base64").then((qrCode: string) => {
      cy.get(tid("wallet-balance.ether.deposit.qr-code")).should(
        "have.attr",
        "src",
        `data:image/svg+xml;base64,${qrCode}`,
      );
    });

    cy.get(tid("wallet-balance.ether.deposit.address")).should(
      "have.text",
      accountFixtureAddress("INV_EUR_ICBM_HAS_KYC_SEED"),
    );
  });
});
