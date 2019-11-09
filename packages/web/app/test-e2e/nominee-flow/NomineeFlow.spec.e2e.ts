import {
  checkField,
  confirmAccessModal,
  goToNomineeDashboard,
  loginFixtureAccount,
} from "../utils/index";
import { tid } from "../utils/selectors";

describe("Nominee flow", () => {
  it("Can redeem share capital", () => {
    loginFixtureAccount("NOMINEE_SIGNING", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    });
    goToNomineeDashboard();

    cy.get(tid("nominee-flow-redeem-share-capital")).should("exist");

    cy.get(tid(`${tid("nominee-flow-redeem-share-capital")} ${tid("value")}`)).then($element => {
      const amountFormatted = $element.text();

      cy.get(tid("eto-nominee-redeem-share-capital-button")).click();

      checkField("amount", amountFormatted);

      cy.get(tid("bank-transfer.reedem-init.continue")).click();
      cy.get(tid("bank-transfer.redeem-summary.continue")).click();
      confirmAccessModal();

      cy.get(tid("bank-transfer.redeem.success.go-to-wallet")).click();
      goToNomineeDashboard();

      cy.get(tid("nominee-flow-redeem-share-capital-waiting-for-isha-signing")).should("exist");
    });
  });
});
