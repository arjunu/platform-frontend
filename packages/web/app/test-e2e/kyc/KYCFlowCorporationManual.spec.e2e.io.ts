import { kycRoutes } from "../../components/kyc/routes";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import { goThroughKycCorporateProcess } from "./utils";

describe("KYC Business flow", () => {
  it("with manual verification should went through KYC business flow", () => {
    createAndLoginNewUser({ type: "investor" });

    // go to corporate start page
    cy.visit(kycRoutes.start);

    cy.screenshot();

    cy.get(tid("kyc-start-go-to-business")).awaitedClick();

    goThroughKycCorporateProcess();

    // panel should now be in pending state
    cy.get(tid("kyc-panel-pending")).should("exist");
  });
});
