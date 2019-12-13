import { etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import { assertDashboard, etoFixtureAddressByName, tid } from "../utils";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto Unapproved Investor View", function(): void {
  this.retries(2);
  before(() => {
    createAndLoginNewUser({ type: "investor" });
    cy.saveLocalStorage();
  });
  beforeEach(() => {
    cy.restoreLocalStorage();
  });
  it("should show investment notification when kyc is not done", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
    assertEtoView(ETO_ID);

    cy.get(tid("eto-overview-settings-update-required-to-invest")).should("exist");

    cy.screenshot();
  });

  describe("for ETO with GE jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    it("should show jurisdiction disclaimer modal and allow to stay after confirm", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      cy.get(tid("jurisdiction-disclaimer-modal")).should("exist");

      cy.screenshot();

      cy.get(tid("jurisdiction-disclaimer-modal.confirm")).click();

      assertEtoView(ETO_ID);
    });

    it("should show jurisdiction disclaimer modal and navigate to dashboard on deny", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      cy.get(tid("jurisdiction-disclaimer-modal")).should("exist");

      cy.get(tid("jurisdiction-disclaimer-modal.deny")).click();

      assertDashboard();
    });
  });
});
