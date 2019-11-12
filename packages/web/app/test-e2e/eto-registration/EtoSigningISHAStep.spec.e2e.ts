import {
  assertEtoDocuments,
  closeModal,
  confirmAccessModal,
  fillForm,
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

describe("Eto Signing ISHA", () => {
  it(`
    should upload signed ISHA and then sign ISHA on-chain 
  `, () => {
    loginFixtureAccount("ISSUER_SIGNING", {
      kyc: "business",
      signTosAgreement: true,
      clearPendingTransactions: true,
    });

    assertUploadSignedISHAFlow();

    assertSignISHAOnChainFlow();

    // TODO: Go through nominee flow and sign ISHA
  });
});
