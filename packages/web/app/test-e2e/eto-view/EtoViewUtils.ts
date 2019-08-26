import { appRoutes } from "../../components/appRoutes";
import { etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import { tid } from "../utils/selectors";
import { getEto } from "../utils/userHelpers";

export const assertEtoView = (etoID: string) => {
  getEto(etoID).then(eto => {
    cy.get(tid("eto.public-view")).should("exist");
    cy.title().should(
      "eq",
      `${eto.company.brandName} - ${eto.equityTokenName} (${
        eto.equityTokenSymbol
      }) - Neufund Platform`,
    );

    if (eto.product.jurisdiction) {
      cy.get(tid(`eto.public-view.jurisdiction-banner.${eto.product.jurisdiction}`)).should(
        "exist",
      );
      cy.url().should("contain", eto.product.jurisdiction);
    }
  });
};

export const goToEtoViewById = (etoId: string) => {
  cy.visit(etoPublicViewByIdLinkLegacy(etoId));

  assertEtoView(etoId);
};

export const goToIssuerEtoView = () => {
  cy.visit(appRoutes.etoIssuerView);

  assertIssuerEtoView();
};

export const assertIssuerEtoView = () => {
  cy.url().should("contain", "/eto/view");

  cy.get(tid("eto.public-view")).should("exist");
};
