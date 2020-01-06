import { kycRoutes } from "../../components/kyc/routes";
import { tid } from "../utils";
import { fillForm } from "../utils/forms";
import { confirmAccessModal } from "../utils/index";
import {
  kycCompanyDocsForm,
  kycCorporateCompanyForm,
  kycLegalRepDocsForm,
  kycLegalRepForm,
} from "./fixtures";

export const goToPersonalVerification = () => {
  cy.visit(kycRoutes.start);

  cy.get(tid("kyc-start-go-to-personal")).click();

  assertIndividualStart();
};

export const assertIndividualStart = () => {
  cy.get(tid("kyc.individual-start")).should("exist");

  cy.url().should("contain", kycRoutes.individualStart);
};

export const assertIndividualAddress = () => {
  cy.get(tid("kyc.individual-address")).should("exist");

  cy.url().should("contain", kycRoutes.individualAddress);
};

export const assertIndividualDocumentVerification = () => {
  cy.get(tid("kyc.individual-document-verification")).should("exist");

  cy.url().should("contain", kycRoutes.individualDocumentVerification);
};

export const goThroughKycCorporateProcess = () => {
  // fill out and submit business form
  fillForm(kycCorporateCompanyForm);
  fillForm(kycCompanyDocsForm);

  // upload legal rep data
  fillForm(kycLegalRepForm);
  fillForm(kycLegalRepDocsForm, { submit: false });

  // add a new beneficial owner entry
  cy.get(tid("kyc-beneficial-owner-add-new")).awaitedClick();
  // remove him again
  cy.get(tid("kyc-beneficial-owner-delete")).awaitedClick();

  // submit and accept
  cy.get(tid("kyc-company-legal-representative-upload-and-submit")).awaitedClick();
  confirmAccessModal();
};
