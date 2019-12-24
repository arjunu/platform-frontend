import { assertEtoDocuments } from "../utils/assertions";
import { fillForm, TFormFixture, uploadDocumentToFieldWithTid } from "../utils/forms";
import { goToIssuerDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";
import {
  assertUploadISHAStep,
  assertUploadMemorandumDocumentStep,
  assertWaitingForSmartContractsStep,
} from "./EtoRegistrationUtils";

const assertUploadISHAtFlow = () => {
  goToIssuerDashboard();

  assertUploadISHAStep();

  cy.get(tid("dashboard-upload-isha-widget.call-to-action")).click();

  assertEtoDocuments();

  const documentsForm2: TFormFixture = {
    "form.name.investment_and_shareholder_agreement_preview": {
      value: "example2.pdf",
      options: {
        acceptWallet: false,
      },
      method: "document",
      type: "custom",
    },
  };

  fillForm(documentsForm2, {
    submit: false,
    methods: { document: uploadDocumentToFieldWithTid },
  });
};

const assertUploadOfferingDocumentFlow = () => {
  goToIssuerDashboard();

  assertUploadMemorandumDocumentStep();

  cy.get(tid("dashboard-upload-investment-memorandum-widget.call-to-action")).click();

  assertEtoDocuments();

  const documentsForm: TFormFixture = {
    "form.name.approved_investor_offering_document": {
      value: "example.pdf",
      method: "document",
      type: "custom",
    },
  };

  fillForm(documentsForm, {
    submit: false,
    methods: { document: uploadDocumentToFieldWithTid },
  });
};

describe("Eto Forms upload offering document and ISHA steps", () => {
  it(`
    should upload offering document and isha document
    and assert waiting for contracts step
  `, () => {
    loginFixtureAccount("ISSUER_LISTED");

    assertUploadOfferingDocumentFlow();

    assertUploadISHAtFlow();

    goToIssuerDashboard();
    assertWaitingForSmartContractsStep();
  });
});
