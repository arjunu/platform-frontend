import {
  assertErrorModal,
  assertIssuerDashboard,
  goToDashboard,
  logoutViaAccountMenu,
  registerWithLightWalletETO,
} from "../utils";
import { createAndLoginNewUser, getWalletMetaData } from "../utils/userHelpers";

describe("Wallet backup e2e recovery phrase", () => {
  const passowrd = "strongpassword";

  it("should register user with light-wallet", () => {
    cy.clearLocalStorage();
    registerWithLightWalletETO("moe-wallet-backup-e2e@test.com", passowrd);

    assertIssuerDashboard();
    cy.screenshot();
  });

  it("should raise an error that user is already used", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "individual",
    }).then(() => {
      const metaData = getWalletMetaData();
      goToDashboard();
      logoutViaAccountMenu();
      registerWithLightWalletETO(metaData.email, passowrd, false);

      assertErrorModal();
      cy.screenshot();
    });
  });
});
