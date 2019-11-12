import { TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { etoFixtureAddressByName, shouldDownloadDocument, tid } from "../utils";
import { createAndLoginNewUser, getEto, loginFixtureAccount } from "../utils/userHelpers";
import { goToEtoViewById } from "./EtoViewUtils";

const asserISHADocumentsHidden = () => {
  // assert ISHA is hidden in investment terms form
  cy.get(
    tid("eto-public-view.investment-terms.document.signed_investment_and_shareholder_agreement"),
  ).should("not.exist");
  cy.get(
    tid("eto-public-view.investment-terms.document.investment_and_shareholder_agreement_preview"),
  ).should("not.exist");
  cy.get(tid("eto-public-view.investment-terms.document.signed_termsheet")).should("exist");

  // assert ISHA is hidden from legal documents
  cy.get(tid("eto-public-view.documents.signed_investment_and_shareholder_agreement")).should(
    "not.exist",
  );
  cy.get(tid("eto-public-view.documents.investment_and_shareholder_agreement_preview")).should(
    "not.exist",
  );
  cy.get(tid("eto-public-view.documents.investment_and_shareholder_agreement")).should("not.exist");
};

const assertISHAConfidentialityAgreement = () => {
  cy.get(tid("eto-public-view.documents.investment_and_shareholder_agreement_preview")).click();

  cy.get(tid("eto.document-confidentiality-agreement-modal")).should("exist");

  shouldDownloadDocument(
    "eto.document-confidentiality-agreement-modal.confirm",
    "Investment and Shareholder Agreement.pdf",
  );

  cy.get(tid("eto.document-confidentiality-agreement-modal")).should("not.exist");

  // should not ask for confirmation again
  shouldDownloadDocument(
    "eto-public-view.documents.investment_and_shareholder_agreement_preview",
    "Investment and Shareholder Agreement.pdf",
  );
};

describe("Eto ISHA documents", () => {
  it("should hide ISHA documents from unauthorized and unverified user", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInClaimState");

    // assert for unauthorized user
    goToEtoViewById(ETO_ID);
    asserISHADocumentsHidden();

    // assert for logged in user unverified user
    createAndLoginNewUser({ type: "investor" });

    goToEtoViewById(ETO_ID);
    asserISHADocumentsHidden();
  });

  it("should ask for ISHA confidentiality agreement once when downloading from eto investment terms section", () => {
    createAndLoginNewUser({ type: "investor", kyc: "business" });

    getEto(etoFixtureAddressByName("ETOInSigningState")).then((eto: TEtoSpecsData) => {
      goToEtoViewById(eto.etoId, eto.previewCode);

      cy.get(
        tid(
          "eto-public-view.investment-terms.document.investment_and_shareholder_agreement_preview",
        ),
      ).click();

      cy.get(tid("eto.document-confidentiality-agreement-modal")).should("exist");

      shouldDownloadDocument(
        "eto.document-confidentiality-agreement-modal.confirm",
        "Investment and Shareholder Agreement.pdf",
      );

      cy.get(tid("eto.document-confidentiality-agreement-modal")).should("not.exist");

      // should not ask for confirmation again
      shouldDownloadDocument(
        "eto-public-view.investment-terms.document.investment_and_shareholder_agreement_preview",
        "Investment and Shareholder Agreement.pdf",
      );
    });
  });

  it("should ask for ISHA confidentiality agreement once when downloading from legal documents section", () => {
    createAndLoginNewUser({ type: "investor", kyc: "business" });

    getEto(etoFixtureAddressByName("ETOInClaimState")).then((eto: TEtoSpecsData) => {
      goToEtoViewById(eto.etoId, eto.previewCode);
    });

    assertISHAConfidentialityAgreement();
  });

  it("should not as for for ISHA confidentiality agreement when user is an owner (nominee or issuer)", () => {
    const ETO_ID = etoFixtureAddressByName("ETOInPayoutState");

    getEto(ETO_ID).then((eto: TEtoSpecsData) => {
      // TODO: there is a wrong derivation path in fixtures for NOMINEE_PAYOUT
      // Check nominee
      // loginFixtureAccount("NOMINEE_PAYOUT", { signTosAgreement: true, kyc: "business" });
      //
      // goToEtoViewById(ETO_ID, eto.previewCode);
      //
      // shouldDownloadDocument(
      //   "eto-public-view.documents.investment_and_shareholder_agreement_preview",
      //   "Investment and Shareholder Agreement.pdf",
      // );
      //
      // logout();

      // Check issuer
      loginFixtureAccount("ISSUER_PAYOUT", { kyc: "business" }).then(() => {
        goToEtoViewById(ETO_ID, eto.previewCode);

        shouldDownloadDocument(
          "eto-public-view.documents.investment_and_shareholder_agreement_preview",
          "Investment and Shareholder Agreement.pdf",
        );
      });
    });
  });
});
