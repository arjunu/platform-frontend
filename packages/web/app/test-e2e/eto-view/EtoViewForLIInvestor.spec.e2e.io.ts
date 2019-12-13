import { etoPublicViewByIdLink, etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { etoFixtureAddressByName } from "../utils";
import { assertDashboard } from "../utils/assertions";
import { loginFixtureAccount } from "../utils/userHelpers";
import { assertEtoView } from "./EtoViewUtils";

describe("Eto LI Investor View", () => {
  beforeEach(() =>
    loginFixtureAccount("SPARE_1", {
      kyc: "business",
    }),
  );

  describe("for ETO with LI jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    it("should allow to visit ", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
      assertEtoView(ETO_ID);

      cy.screenshot();
    });

    it("should not allow link with wrong Jurisdiction ", () => {
      cy.visit(etoPublicViewByIdLink(ETO_ID, EJurisdiction.GERMANY));
      assertDashboard();
    });
  });

  describe("for ETO with GE jurisdiction", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInWhitelistState");

    it("should not allow to visit", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));

      assertDashboard();
    });
  });
});
