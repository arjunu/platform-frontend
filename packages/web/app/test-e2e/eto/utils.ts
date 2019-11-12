import { goToEtoViewById } from "../eto-view/EtoViewUtils";
import { tid } from "../utils";

export const assertInvestmentModal = () => {
  cy.get(tid("modals.investment.modal")).should("exist");
};

export const startInvestmentFlow = (etoId: string) => {
  goToEtoViewById(etoId);

  cy.get(tid("eto-invest-now-button-" + etoId)).click();

  assertInvestmentModal();
};
