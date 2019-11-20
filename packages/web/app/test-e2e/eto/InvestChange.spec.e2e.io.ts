import { etoFixtureAddressByName } from "../utils";
import { goToDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Invest with change", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC", {
      kyc: "business",
      clearPendingTransactions: true,
    });

    goToDashboard();

    // click invest now button
    cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
    cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

    // select euro from icbm wallet
    cy.get(tid("investment-type.selector.ICBM_NEUR")).check({ force: true });
    cy.get(tid("invest-modal-eur-field"))
      .clear()
      .type("500");

    cy.wait(1000);

    cy.get(tid("invest-modal-invest-now-button")).click();

    cy.get(tid("invest-modal-summary-change-button")).click();

    cy.get(tid("invest-modal-eur-field"))
      .clear()
      .type("800");

    cy.get(tid("invest-modal-invest-now-button")).click();

    cy.get(tid("invest-modal-summary-your-investment")).contains("800 EUR");
  });
});
