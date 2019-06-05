import {
  assertDashboard,
  assertVerifyEmailWidgetIsInNoEmailState,
  assertVerifyEmailWidgetIsInUnverifiedEmailState,
  assertVerifyEmailWidgetIsInVerfiedEmailState,
  closeModal,
  confirmAccessModal,
  convertToUniqueEmail,
  registerWithLightWallet,
  verifyLatestUserEmail,
} from "../utils";
import { tid } from "../utils/selectors";
import { generateRandomEmailAddress } from "../utils/userHelpers";

describe("Verify Email Widget", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  it("should change user email after register", () => {
    const firstEmail = generateRandomEmailAddress();
    const secondEmail = generateRandomEmailAddress();
    const password = "strongpassword";

    registerWithLightWallet(firstEmail, password);
    assertDashboard();

    cy.get(tid("authorized-layout-profile-button")).awaitedClick();
    assertVerifyEmailWidgetIsInUnverifiedEmailState();
    cy.get(tid("verify-email-widget.change-email.button")).awaitedClick();
    assertVerifyEmailWidgetIsInNoEmailState();

    cy.get(tid("verify-email-widget-form-email-input")).type(secondEmail);
    cy.get(tid("verify-email-widget-form-submit")).awaitedClick();

    confirmAccessModal();

    // Email server takes time before getting the request
    cy.wait(3000);
    verifyLatestUserEmail(secondEmail);

    assertVerifyEmailWidgetIsInVerfiedEmailState();
    assertVerifyEmailWidgetIsInUnverifiedEmailState(true);
    assertVerifyEmailWidgetIsInNoEmailState(true);
  });

  it("should not send a request when access modal is cancelled", () => {
    const firstEmail = "moe-wallet-backup-e2e+1@test.com";
    const secondEmail = convertToUniqueEmail(firstEmail);
    const password = "strongpassword";

    registerWithLightWallet(firstEmail, password);
    assertDashboard();

    cy.get(tid("authorized-layout-profile-button")).awaitedClick();
    assertVerifyEmailWidgetIsInUnverifiedEmailState();
    cy.get(tid("verify-email-widget.change-email.button")).awaitedClick();
    assertVerifyEmailWidgetIsInNoEmailState();

    cy.get(tid("verify-email-widget-form-email-input")).type(secondEmail);
    cy.get(tid("verify-email-widget-form-submit")).awaitedClick();

    closeModal();
  });
});