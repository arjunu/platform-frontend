import { confirmAccessModal, etoFixtureAddressByName, LONG_WAIT_TIME } from "../utils";
import { goToDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Invest with euro token", () => {
  const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
  it("do", () => {
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC", {
      kyc: "business",
      clearPendingTransactions: true,
    }).then(() => {
      goToDashboard();

      cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
      // click invest now button
      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID), { timeout: LONG_WAIT_TIME }).click();
      // select euro from icbm wallet
      cy.wait(1000);
      cy.get(tid("investment-type.selector.ICBM_NEUR")).check({ force: true });
      cy.get(tid("invest-modal-eur-field"))
        .clear()
        .type("500");
      cy.wait(1000);
      cy.get(tid("invest-modal-invest-now-button")).click();
      cy.get(tid("invest-modal-summary-confirm-button")).click();
      confirmAccessModal();
      cy.get(tid("investment-flow.success.title")).should("exist");
      // TODO check smart contracts balances
    });
  });
});
