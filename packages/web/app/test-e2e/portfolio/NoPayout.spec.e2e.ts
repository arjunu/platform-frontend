import { goToPortfolio } from "../utils";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Investor empty payout", () => {
  beforeEach(() => loginFixtureAccount("INV_EMPTY_HAS_KYC"));

  it("should show message that there are no payouts", () => {
    goToPortfolio();

    cy.get(tid(`asset-portfolio.no-payouts`)).should("exist");
  });
});
