import {
  assertDashboard,
  assertVerifyEmailWidgetIsInVerfiedEmailState,
  createAndLoginNewUser,
  fillForm,
  generateRandomEmailAddress,
  getLatestVerifyUserEmailLink,
  goToDashboard,
  logoutViaAccountMenu,
  registerWithLightWallet,
  tid,
} from "../utils";

describe("Verify Wallet", () => {
  it("should update login email on activation", () => {
    const TEST_LINK =
      "https://localhost:9090/email-verify?code=b7fb21ea-b248-4bc3-8500-b3f2b8644c17&email=pavloblack%40hotmail.com&user_type=investor&wallet_type=light&wallet_subtype=unknown&salt=XzNJFpdkgjOxrUXPFD6NmzkUGGpUmuA5vjrt1xyMFd4%3D";

    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();

      logoutViaAccountMenu();

      goToDashboard(false);

      cy.get(tid("light-wallet-login-with-email-email-field")).then(registerEmailNode => {
        const registerEmail = registerEmailNode.text();
        cy.log("Email used for registering:", registerEmail);
        // Use activation link
        cy.visit(TEST_LINK);
        cy.get(tid("light-wallet-login-with-email-email-field")).then(activationEmailNode => {
          const activationEmail = activationEmailNode.text();
          expect(activationEmail).to.not.equal(registerEmail);
        });
      });
    });
  });

  it("should logout previous user when email activation occurs", () => {
    const email = generateRandomEmailAddress();
    const password = "strongpassword";

    registerWithLightWallet(email, password);
    assertDashboard();

    getLatestVerifyUserEmailLink(email).then(activationLink => {
      logoutViaAccountMenu();

      // register another user
      const newEmail = generateRandomEmailAddress();
      registerWithLightWallet(newEmail, password);

      assertDashboard();

      // try to activate previous user when second one is logged in
      cy.visit(activationLink);

      // Asserts if error toast shows up
      // @SEE https://github.com/Neufund/platform-frontend/issues/2709
      cy.get(tid("modules.auth.sagas.verify-user-email.toast.verification-failed")).should("exist");

      cy.get(tid("light-wallet-login-with-email-email-field")).contains(email);

      fillForm({
        password,
        "wallet-selector-nuewallet.login-button": {
          type: "submit",
        },
      });

      // email should be verified
      assertVerifyEmailWidgetIsInVerfiedEmailState();
      cy.get(tid("profile.verify-email-widget.verified-email")).contains(email);
    });
  });
});
