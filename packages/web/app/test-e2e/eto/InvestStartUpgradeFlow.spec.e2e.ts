import { etoFixtureAddressByName, goToDashboard } from "../utils/index";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Start upgrade flow from investment", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    // TODO: you need another fixture that has ICBM wallet but is not upgraded in any other test
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).awaitedClick();
      // click invest now button
      cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).awaitedClick();

      cy.get(tid("investment-type.selector.ICBM_NEUR.enable-wallet")).awaitedClick();

      // check if upgrade accept has shown
      cy.get(tid("modals.tx-sender.upgrade-flow.summery.upgradeSummary.accept")).should("exist");

      // TODO: Cover full flow with new fixture when available
    });
  });
});
