import {
  assertIssuerDashboard,
  generateRandomEmailAddress,
  loginWithLightWallet,
  logoutViaAccountMenu,
  registerWithLightWalletETO,
} from "../utils/index";

const PASSWORD = "strongpassword";

const loginWithLightWalletETO = (testEmail: string, password: string) => {
  registerWithLightWalletETO(testEmail, password);
  assertIssuerDashboard();

  logoutViaAccountMenu();
  loginWithLightWallet(testEmail, password);
  assertIssuerDashboard();
};

describe("Light Wallet ETO Login", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });
  it("should register logout then login as an investor", () => {
    const testEmail = generateRandomEmailAddress();
    loginWithLightWalletETO(testEmail, PASSWORD);
  });
  it("should login/logout as investor navigate to ETO then login/logout as issuer", () => {
    const testEmail = generateRandomEmailAddress();
    loginWithLightWalletETO(testEmail, PASSWORD);
  });
});
