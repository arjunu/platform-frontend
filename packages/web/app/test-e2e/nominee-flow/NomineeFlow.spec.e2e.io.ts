import { goThroughKycCorporateProcess } from "../kyc/utils";
import { backupLightWalletSeedFromAccountSetupDashboard } from "../shared/backupLightWalletSeed";
import {
  assertNomineeDashboard,
  generateRandomEmailAddress,
  loginWithLightWallet,
  logoutViaAccountMenu,
  registerWithLightWalletNominee,
  verifyLatestUserEmailAccountSetup,
} from "../utils/index";
import { tid } from "../utils/selectors";

describe("Nominee flow", () => {
  const password = "strongpassword";
  const email = generateRandomEmailAddress();

  it("should register nominee with light-wallet, let them logout and login again", () => {
    registerWithLightWalletNominee(email, password);
    assertNomineeDashboard();

    logoutViaAccountMenu();
    loginWithLightWallet(email, password);
    assertNomineeDashboard();

    cy.get(tid("account-setup-email-unverified-section")).should("exist");

    cy.screenshot();

    verifyLatestUserEmailAccountSetup(email);

    cy.get(tid("account-setup-backup-seed-section")).should("exist");

    cy.screenshot();

    backupLightWalletSeedFromAccountSetupDashboard();

    cy.get(tid("account-setup-start-kyc-section")).should("exist");

    cy.screenshot();

    cy.get(tid("start-kyc-button")).awaitedClick();
    goThroughKycCorporateProcess();
    cy.get(tid("generic-modal-dismiss-button")).awaitedClick();
    cy.get(tid("nominee-kyc-pending")).should("exist");

    cy.screenshot();
  });
});
