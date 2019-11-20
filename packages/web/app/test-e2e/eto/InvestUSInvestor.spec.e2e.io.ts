import { goToEtoViewById } from "../eto-view/EtoViewUtils";
import { etoFixtureAddressByName } from "../utils";
import { assertDashboard } from "../utils/assertions";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("US investors investment flow", () => {
  it("should block investment flow for us investors", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount("demoinvestor10", {
      kyc: "individual",
      signTosAgreement: true,
      clearPendingTransactions: true,
    });

    goToEtoViewById(PUBLIC_ETO_ID);

    cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).should("not.exist");

    cy.get(tid("investment-widget.us-investor-message")).should("exist");

    cy.get(tid("investment-widget.us-investor-message.go-to-dashboard")).click();

    assertDashboard();
  });
});
