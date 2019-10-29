import BigNumber from "bignumber.js";

import {
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
} from "../../components/shared/formatters/utils";
import {
  assertButtonIsActive,
  closeModal,
  confirmAccessModal,
  etoFixtureAddressByName,
  getFormattedNumber,
  goToDashboard,
  loginFixtureAccount,
  parseAmount,
  tid,
} from "../utils";

describe("Invest with nEur", () => {
  it("invest nEuro and check whether UI is refreshed with invested amount", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    const INVESTED_NEUR_AMOUNT = 99.99;

    loginFixtureAccount("demoinvestor1", {
      kyc: "individual",
      signTosAgreement: true,
      clearPendingTransactions: true,
    });

    goToDashboard();

    // click invest now button
    cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();

    cy.get(`${tid("investment-widget-total-nEur-invested")} ${tid("value")}`)
      .then($e => parseAmount($e.text()))
      .as("nEurInvested");

    cy.get(tid(`eto-invest-now-button-${PUBLIC_ETO_ID}`)).click();

    cy.get(tid("investment-type.selector.NEUR")).check({ force: true });

    cy.get(tid("invest-modal-eur-field"))
      .clear()
      .type(INVESTED_NEUR_AMOUNT.toString());

    // wait for calculation to complete
    assertButtonIsActive("invest-modal-invest-now-button");

    cy.get(tid("invest-modal.est-neu-tokens"))
      .then($element => parseAmount($element.text()))
      .as("estimatedReward");

    cy.get(tid("invest-modal-invest-now-button")).click();

    cy.get(tid("invest-modal-summary-confirm-button")).click();

    confirmAccessModal();

    cy.get(tid("investment-flow.success.title")).should("exist");

    closeModal();

    cy.get<BigNumber>("@nEurInvested").then(previousAmount => {
      cy.get(`${tid("investment-widget-total-nEur-invested")} ${tid("value")}`).should(
        "contain",
        getFormattedNumber(
          previousAmount.plus(INVESTED_NEUR_AMOUNT.toString()).toString(),
          ERoundingMode.UP,
          2,
          ENumberInputFormat.FLOAT,
          ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
        ),
      );
    });
  });
});
