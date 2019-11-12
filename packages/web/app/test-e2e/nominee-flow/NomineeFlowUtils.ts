import { tid } from "../utils";
import { fillForm } from "../utils/forms";
import { confirmAccessModal, loginFixtureAccount, logout } from "../utils/index";
import { goToNomineeDashboard } from "../utils/navigation";

export const linkEtoToNominee = (address: string) => {
  goToNomineeDashboard();

  cy.get(tid("nominee-flow.link-with-issuer-input")).type(address);

  cy.get(tid("nominee-flow.link-with-issuer-submit")).click();

  cy.get(tid("nominee-request-pending")).should("exist");
};

export const signAgreement = (
  containerSelector: string,
  modalSelector: string,
  successModalSelector: string,
) => () => {
  cy.get(containerSelector).should("exist");
  cy.get(tid("eto-nominee-sign-agreement-action")).click();

  cy.get(modalSelector).should("exist");

  fillForm({
    acceptAgreement: {
      type: "toggle",
      checked: true,
    },
    "nominee-sign-agreement-sign": {
      type: "submit",
    },
  });

  confirmAccessModal();

  cy.get(successModalSelector).should("exist");
  cy.get(tid("nominee-sign-agreement-success-close")).click();
};

export const signTHA = signAgreement(
  tid("nominee-flow-sign-tha"),
  tid("nominee-sign-tha-modal"),
  tid("nominee-sign-tha-modal-success"),
);
export const signRAAA = signAgreement(
  tid("nominee-flow-sign-raaa"),
  tid("nominee-sign-raaa-modal"),
  tid("nominee-sign-raaa-modal-success"),
);

export const assertNoTasks = () => {
  cy.get(tid("nominee-flow-no-tasks")).should("exist");
};

export const assertNomineeAgreementsSigningFlow = () => {
  loginFixtureAccount("NOMINEE_SETUP_NO_ST", {
    kyc: "business",
    signTosAgreement: true,
    clearPendingTransactions: true,
  });
  goToNomineeDashboard();

  signTHA();
  signRAAA();

  assertNoTasks();

  logout();
};
