import { kycRoutes } from "../../components/kyc/routes";
import { goThroughKycCorporateProcess } from "../utils/index";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";

describe("KYC Business flow", () => {
  it("with manual verification should went through KYC business flow", () => {
    createAndLoginNewUser({ type: "investor" });

    // go to corporate start page
    cy.visit(kycRoutes.start);
    cy.get(tid("kyc-start-go-to-company")).awaitedClick();

    goThroughKycCorporateProcess();

    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending")).should("exist");
  });
});
