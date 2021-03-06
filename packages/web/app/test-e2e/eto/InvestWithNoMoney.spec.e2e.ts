import { ETHEREUM_ZERO_ADDRESS } from "../../config/constants";
import { EWalletType } from "../../modules/web3/types";
import { goToEtoViewById } from "../eto-view/EtoViewUtils";
import {
  confirmAccessModal,
  createAndLoginNewUser,
  etoFixtureAddressByName,
  goToDashboard,
  loginFixtureAccount,
  tid,
} from "../utils";
import { sendEth } from "../utils/ethRpcUtils";

describe("Try and invest without money", () => {
  it("should keep invest button disabled", () => {
    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    });
    goToDashboard();

    // make sure that INV_EMPTY_HAS_KYC has no ether by sending ether to address 0
    // all required helper functions are available.

    // click invest now button
    cy.get(tid(`eto-overview-${PUBLIC_ETO_ID}`)).click();
    cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

    cy.get(tid("invest-modal-eth-field"))
      .clear()
      .type("10");

    cy.get(tid("invest-modal-invest-now-button")).should("be.disabled");
  });

  it.skip("should invest when user has no ether - Gasless Transaction", () => {
    const fixture = "INV_ETH_EUR_ICBM_M_HAS_KYC_DUP_HAS_NEUR_AND_NO_ETH";

    sendEth(fixture, ETHEREUM_ZERO_ADDRESS, "all");

    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount(fixture);

    goToEtoViewById(PUBLIC_ETO_ID);

    cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

    cy.get(tid("investment-type.selector.ICBM_NEUR")).check({ force: true });

    cy.get(tid("invest-modal-eur-field"))
      .clear()
      .type("1000");

    cy.get(tid("invest-modal-invest-now-button"))
      .should("be.enabled")
      .click();

    cy.get(tid("invest-modal-summary-confirm-button")).click();
    confirmAccessModal();

    cy.get(tid("investment-flow.success.title")).should("exist");
  });

  it("should show error message when there is no enough ether for gas during neur investment - NO GAS STIPEND", () => {
    const fixture = "INV_ETH_EUR_ICBM_M_HAS_KYC_DUP_HAS_NEUR_AND_NO_ETH";

    sendEth(fixture, ETHEREUM_ZERO_ADDRESS, "all");

    const PUBLIC_ETO_ID = etoFixtureAddressByName("ETOInPublicState");

    loginFixtureAccount(fixture);

    cy.window().then(Window => {
      const oldValue = JSON.parse(Window.localStorage.getItem("NF_WALLET_METADATA")!);
      Window.localStorage.setItem(
        "NF_WALLET_METADATA",
        JSON.stringify({
          ...oldValue,
          // MAKE SURE THIS WALLET IS INELIGIBLE FOR STIPEND
          walletType: EWalletType.BROWSER,
        }),
      );
      goToEtoViewById(PUBLIC_ETO_ID);

      cy.get(tid("eto-invest-now-button-" + PUBLIC_ETO_ID)).click();

      cy.get(tid("investment-type.selector.ICBM_NEUR")).check({ force: true });

      cy.get(tid("invest-modal-eur-field"))
        .clear()
        .type("1000");

      cy.get(tid("form.euroValue.error-message")).should("exist");
      cy.get(tid("invest-modal-invest-now-button")).should("be.disabled");
    });
  });
});
