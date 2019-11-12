import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  formatNumber,
  selectDecimalPlaces,
} from "../../components/shared/formatters/utils";
import { fillForm } from "../utils/forms";
import { assertWallet, getWalletNEurAmount } from "../utils/index";
import { formField, tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";
import { assertBankAccountDetails } from "./assertions";

describe("Redeem NEUR", function(): void {
  this.retries(2);
  beforeEach(() => {
    loginFixtureAccount("demoinvestor2", {
      kyc: "individual",
    }).then(() => {
      // store actual balance
      getWalletNEurAmount().as("currentAmount");

      assertWallet();

      // check if bank account is linked
      assertBankAccountDetails();

      // start redeem flow
      cy.get(tid("wallet-balance.neur.redeem-button")).click();
    });
  });

  it("should not allow to use value below 5 NEUR", () => {
    fillForm(
      {
        amount: "2.22",
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");
  });

  it("should not allow to use value above NEUR balance", () => {
    fillForm(
      {
        amount: "9999999999.99",
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");
  });

  it("should correctly format input", () => {
    const value = "-3s32aa@fax2.24@#2535%s9sf92";

    fillForm(
      {
        amount: value,
      },
      { submit: false },
    );
    cy.get(tid("form.amount.error-message")).should("exist");
    cy.get(tid("bank-transfer.reedem-init.continue")).should("be.disabled");

    const nextValue = "123456789.99";

    fillForm(
      {
        amount: nextValue,
      },
      { submit: false },
    );

    const nextExpectedValue = formatNumber({
      value: nextValue,
      outputFormat: ENumberOutputFormat.FULL,
      inputFormat: ENumberInputFormat.FLOAT,
      decimalPlaces: selectDecimalPlaces(ECurrency.EUR),
    });

    cy.get(formField("amount")).should("have.value", nextExpectedValue);
  });

  it("should work correctly after start of link back account flow start", () => {
    fillForm(
      {
        amount: "124",
      },
      { submit: false },
    );

    // search only for button inside modal
    cy.get(".modal-content").within(() => {
      cy.get(tid("locked-wallet.neur.bank-account.link-account")).click();
    });

    // close bank account link modal
    cy.get(tid("bank-transfer.summary.transfer-completed"));
    cy.get(tid("modal-close-button"))
      .last()
      .click();

    fillForm(
      {
        amount: "532",
      },
      { submit: false },
    );

    cy.get(tid("bank-transfer.redeem.fee")).within(() => {
      cy.get(tid("value")).should("not.contain", "0");
    });
  });

  it("should show the same fee and total after continue", () => {
    fillForm(
      {
        amount: "2137.69",
      },
      { submit: false },
    );

    cy.get(`${tid("bank-transfer.redeem.total")} ${tid(`value`)}`)
      .then(v => v.text())
      .as("total");
    cy.get(`${tid("bank-transfer.redeem.fee")} ${tid(`value`)}`)
      .then(v => v.text())
      .as("fee");

    cy.get(tid("bank-transfer.reedem-init.continue")).click();

    cy.get(`${tid("bank-transfer.redeem.total")} ${tid(`value`)}`).then(newTotal => {
      cy.get<string>("@total").then(total => {
        expect(newTotal.text()).eq(total);
      });
    });

    cy.get(`${tid("bank-transfer.redeem.fee")} ${tid(`value`)}`).then(newFee => {
      cy.get<string>("@fee").then(fee => {
        expect(newFee.text()).eq(fee);
      });
    });
  });
});
