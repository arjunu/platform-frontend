import {
  assertEtoDocuments,
  checkField,
  closeModal,
  confirmAccessModal,
  dropDocumentToFieldWithTid,
  fillForm,
  goToNomineeDashboard,
  loginFixtureAccount,
  TFormFixture,
  uploadDocumentToFieldWithTid,
} from "../utils/index";
import { goToIssuerDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import {
  assertSignISHAStep,
  assertUploadSignedISHAStep,
  assertWaitForNomineeToSignISHAStep,
} from "./EtoRegistrationUtils";

const assertUploadSignedISHAFlow = () => {
  goToIssuerDashboard();

  assertUploadSignedISHAStep();

  cy.get(tid("dashboard-upload-signed-isha-widget.upload-signed-isha")).click();

  assertEtoDocuments();

  const documentsForm2: TFormFixture = {
    "form.name.investment_and_shareholder_agreement": {
      value: "example2.pdf",
      options: {
        acceptWallet: true,
      },
      method: "document",
      type: "custom",
    },
  };

  fillForm(documentsForm2, {
    submit: false,
    methods: { document: uploadDocumentToFieldWithTid },
  });

  // Assert signing summary is shown right after document was uploaded
  cy.get(tid("eto-flow.sign-isha-summary")).should("exist");
};

const assertSignISHAOnChainFlow = () => {
  goToIssuerDashboard();

  assertSignISHAStep();

  cy.get(tid("dashboard-sign-isha-on-chain-widget.sign")).click();

  cy.get(tid("eto-flow.sign-isha-summary")).should("exist");
  cy.get(tid("eto-flow.sign-isha-summary.continue")).click();

  confirmAccessModal();

  cy.get(tid("modals.shared.signing-message.modal")).should("exist");

  cy.get(tid("modals.shared.tx-success.modal")).should("exist");

  closeModal();

  assertWaitForNomineeToSignISHAStep();
};

describe("Eto in SIGNING state: Nominee and Issuer flow", () => {
  it("Nominee redeems share capital", () => {
    loginFixtureAccount("NOMINEE_SIGNING", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
      customDerivationPath: "m/44'/60'/0'/0",
    });
    goToNomineeDashboard();

    cy.get(tid("nominee-flow-redeem-share-capital")).should("exist");

    cy.get(`${tid("nominee-flow-redeem-share-capital")} ${tid("value")}`).then($element => {
      const amountFormatted = $element.text();

      cy.get(tid("nominee-redeem-share-capital-button")).click();

      checkField("amount", amountFormatted);

      cy.get(tid("bank-transfer.reedem-init.continue")).click();
      cy.get(tid("bank-transfer.redeem-summary.continue")).click();
      confirmAccessModal();

      cy.get(tid("bank-transfer.redeem.success.go-to-wallet")).click();
      goToNomineeDashboard();

      cy.get(tid("nominee-flow-redeem-share-capital-waiting-for-isha-signing")).should("exist");
    });
  });

  it(`Issuer uploads signed ISHA and then signs ISHA on-chain`, () => {
    loginFixtureAccount("ISSUER_SIGNING", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    });

    assertUploadSignedISHAFlow();

    assertSignISHAOnChainFlow();
  });
  // Unskip when the issue with lazy loading and cypress is solved.
  it.skip("Nominee uploads and signs ISHA on-chain", () => {
    loginFixtureAccount("NOMINEE_SIGNING", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
      customDerivationPath: "m/44'/60'/0'/0",
    });
    goToNomineeDashboard();

    cy.get(tid("nominee-flow-sign-isha")).should("exist");

    cy.get(tid("nominee-sign-isha-button")).awaitedClick();

    //first try with a wrong document. A warning should appear. It shouldn't be possible to continue signing
    const badIshaForm: TFormFixture = {
      "form.name.signed_investment_and_shareholder_agreement": {
        value: "example.pdf",
        options: {
          acceptWallet: false,
        },
        method: "document",
        type: "custom",
      },
    };

    fillForm(badIshaForm, {
      submit: false,
      methods: { document: dropDocumentToFieldWithTid },
    });
    // a large code chunk loads at this moment, let's wait for it
    cy.wait(3000);

    cy.get(tid("nominee-sign-agreement.hashes-dont-match")).then($elementHasError => {
      expect($elementHasError.children().length).to.be.greaterThan(0);

      cy.get(tid("nominee-sign-agreement-sign")).should("be.disabled");

      //now try to upload the same document as the issuer's. Hashes should match and it should be possible to continue signing
      const goodIshaForm: TFormFixture = {
        "form.name.signed_investment_and_shareholder_agreement": {
          value: "example2.pdf",
          options: {
            acceptWallet: false,
          },
          method: "document",
          type: "custom",
        },
      };

      fillForm(goodIshaForm, {
        submit: false,
        methods: { document: dropDocumentToFieldWithTid },
      });

      cy.wait(3000);
      cy.get(tid("nominee-sign-agreement.hashes-dont-match")).then($elementHasNoError => {
        expect($elementHasNoError.children().length).to.eq(0);
        cy.get(tid("nominee-sign-agreement-sign")).should("be.enabled");
        cy.get(tid("nominee-sign-agreement-sign")).awaitedClick();
        confirmAccessModal();
        closeModal();

        // eto is now in CLAIM state, nominee has no more tasks
        cy.get(tid("eto-state-4")).should("exist");
        cy.get(tid("nominee-flow-no-tasks")).should("exist");
      });
    });
  });
});
