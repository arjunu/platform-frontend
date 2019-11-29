import { etoFixtureAddressByName } from "../utils";
import { goToPortfolio } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Download documents from portfolio", () => {
  it("do", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPayoutState");
    loginFixtureAccount("INV_ICBM_ETH_M_HAS_KYC_DUP", {
      kyc: "business",
      clearPendingTransactions: true,
    }).then(() => {
      goToPortfolio();

      cy.get(tid(`modals.portfolio.portfolio-assets.download-agreements-${PUBLIC_ETO_ID}`))
        .click()
        .then(() => {
          const downloadSelector = tid(
            `modals.portfolio.portfolio-assets.download-agreements-${PUBLIC_ETO_ID}.download`,
          );
          cy.clock().then(clock => {
            cy.get(downloadSelector)
              .first()
              .parent()
              .click()
              .then(() => {
                cy.get(downloadSelector)
                  .first()
                  .parent()
                  .should("be.disabled");
              });

            // restore clock to native to have all sagas invoked
            clock.restore();

            cy.get(downloadSelector)
              .first()
              .parent()
              .should("not.be.disabled");
          });
        });
    });
  });
});
