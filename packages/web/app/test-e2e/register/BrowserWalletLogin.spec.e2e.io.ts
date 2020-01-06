import PrivateKeyProvider from "truffle-privatekey-provider";

import { NODE_ADDRESS } from "../config";
import {
  acceptTOS,
  accountFixtureAddress,
  accountFixturePrivateKey,
  assertIssuerDashboard,
  goToWallet,
  tid,
} from "../utils/index";
import { goToLanding } from "../utils/navigation";

const ISSUER_SETUP = "ISSUER_SETUP";

const ISSUER_SETUP_NODE_PROVIDER = new PrivateKeyProvider(
  // remove 0x prefix from private key
  accountFixturePrivateKey(ISSUER_SETUP)
    .slice(2)
    .toUpperCase(),
  NODE_ADDRESS,
);

const ISSUER_SETUP_MAIN_NODE_PROVIDER = new PrivateKeyProvider(
  // remove 0x prefix from private key
  accountFixturePrivateKey(ISSUER_SETUP)
    .slice(2)
    .toUpperCase(),
  "https://mainnet.infura.io/v3/ddfed355869142b09396d38dfe4c886d",
);

const ethereumProvider = (provider: any) => {
  cy.window().then(win => {
    (win as any).ethereum = provider;
  });
};

describe("Browser Wallet Login", () => {
  it("should login as issuer with browser wallet", () => {
    goToLanding();

    ethereumProvider(ISSUER_SETUP_NODE_PROVIDER);

    cy.get(tid("Header-login")).click();

    cy.get(tid("wallet-selector-browser")).click();

    cy.get(tid("signing.browser-wallet.sign-prompt")).should("exist");

    assertIssuerDashboard();

    acceptTOS();

    goToWallet();

    cy.get(tid("account-address.your.ether-address.from-div"))
      .invoke("text")
      .then(value => {
        expect(value).to.equal(accountFixtureAddress(ISSUER_SETUP));
      });
  });

  it("should show error message when node doesn't match platform node", () => {
    goToLanding();

    ethereumProvider(ISSUER_SETUP_MAIN_NODE_PROVIDER);

    cy.get(tid("Header-login")).click();

    cy.get(tid("wallet-selector-browser")).click();

    cy.get(tid("browser-wallet-error-msg")).should("exist");

    ethereumProvider(ISSUER_SETUP_NODE_PROVIDER);

    cy.get(tid("browser-wallet-init.try-again")).click();

    cy.get(tid("signing.browser-wallet.sign-prompt")).should("exist");

    assertIssuerDashboard();
  });
});
