import { goToIssuerEtoView } from "../eto-view/EtoViewUtils";
import { linkEtoToNominee } from "../nominee-flow/NomineeFlowUtils";
import { logoutViaAccountMenu } from "../utils/index";
import { goToIssuerDashboard, goToNomineeDashboard } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { createAndLoginNewUser } from "../utils/userHelpers";
import {
  acceptNominee,
  assertFillEtoInformationState,
  assertLinkNomineeStep,
  assertLinkNomineeStepAwaitingApprovalState,
  assertLinkNomineeStepAwaitingRequestState,
  assertPublishListingPage,
  assertUploadSignedTermsheetStep,
  cancelNominee,
  fillAndAssert,
  fillRequiredCompanyInformation,
  rejectNominee,
  submitPreview,
} from "./EtoRegistrationUtils";
import { etoTermsRequiredForm, investmentTermsRequiredForm, votingRights } from "./fixtures";

const fillEtoToLinkNomineeStep = (issuerAddress: string) => {
  fillRequiredCompanyInformation();

  assertPublishListingPage();

  // fill Eto Terms and Investment Terms
  fillAndAssert("eto-progress-widget-investment-terms", investmentTermsRequiredForm);

  fillAndAssert("eto-progress-widget-eto-terms", etoTermsRequiredForm);

  // should move to link nominee
  assertLinkNomineeStepAwaitingRequestState(issuerAddress);
};

describe("Eto Forms link nominee", () => {
  it(`
    should move from "Publish Listing Page" to "Link nominee" step 
    after filling required fields from "Eto Terms" and "Investment Terms" forms
    and then go through nominee linking process on both issuer and nominee side
  `, () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(
      ({ address: issuerAddress }) => {
        cy.saveLocalStorage(issuerAddress);

        fillEtoToLinkNomineeStep(issuerAddress);
        logoutViaAccountMenu();

        createAndLoginNewUser({ type: "nominee", kyc: "business" }).then(
          ({ address: nomineeAddress }) => {
            cy.saveLocalStorage(nomineeAddress);

            linkEtoToNominee(issuerAddress);

            // get back issuer
            cy.restoreLocalStorage(issuerAddress);

            // should await nominee acceptation on dashboard
            goToIssuerDashboard();
            assertLinkNomineeStepAwaitingApprovalState();

            acceptNominee(nomineeAddress);

            // should move to setup eto state after nominee was accepted
            goToIssuerDashboard();

            assertFillEtoInformationState();

            fillAndAssert("eto-progress-widget-voting-right", votingRights);

            goToIssuerDashboard();
            assertUploadSignedTermsheetStep();

            // get back to nominee
            cy.restoreLocalStorage(nomineeAddress);

            // should have eto linked
            goToIssuerEtoView();
          },
        );
      },
    );
  });

  it(`
    should move from "Publish Listing Page" to "Link nominee" step 
    after filling required fields from "Eto Terms" and "Investment Terms" forms
    and then nominee request approval and issuer rejects it 
  `, () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(
      ({ address: issuerAddress }) => {
        cy.saveLocalStorage(issuerAddress);

        fillEtoToLinkNomineeStep(issuerAddress);
        logoutViaAccountMenu();

        createAndLoginNewUser({ type: "nominee", kyc: "business" }).then(
          ({ address: nomineeAddress }) => {
            cy.saveLocalStorage(nomineeAddress);

            linkEtoToNominee(issuerAddress);
            logoutViaAccountMenu();

            // get back issuer
            cy.restoreLocalStorage(issuerAddress);

            // should await nominee acceptation on dashboard
            goToIssuerDashboard();
            assertLinkNomineeStepAwaitingApprovalState();

            rejectNominee();

            // should move back to link nominee step
            goToIssuerDashboard();
            assertLinkNomineeStepAwaitingRequestState(issuerAddress);
            logoutViaAccountMenu();

            // get back to nominee
            cy.restoreLocalStorage(nomineeAddress);

            // should show rejected request information
            goToNomineeDashboard();
            cy.get(tid(`nominee-dashboard-request-rejected-${issuerAddress}`));
          },
        );
      },
    );
  });

  it(`
    should move from "Publish Listing Page" to "Link nominee" step 
    after filling required fields from "Eto Terms" and "Investment Terms" forms
    and then nominee request approval and issuer approves but later cancels it 
  `, () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(
      ({ address: issuerAddress }) => {
        cy.saveLocalStorage(issuerAddress);

        fillEtoToLinkNomineeStep(issuerAddress);
        logoutViaAccountMenu();

        createAndLoginNewUser({ type: "nominee", kyc: "business" }).then(
          ({ address: nomineeAddress }) => {
            cy.saveLocalStorage(nomineeAddress);

            linkEtoToNominee(issuerAddress);
            logoutViaAccountMenu();

            // get back issuer
            cy.restoreLocalStorage(issuerAddress);

            // should await nominee acceptation on dashboard
            goToIssuerDashboard();
            cy.get(tid("eto-dashboard-accept-nominee")).should("exist");

            acceptNominee(nomineeAddress);

            cancelNominee(nomineeAddress);

            // should move back to link nominee step
            goToIssuerDashboard();
            assertLinkNomineeStep();
            logoutViaAccountMenu();

            // get back to nominee
            cy.restoreLocalStorage(nomineeAddress);

            // should show rejected request information
            goToNomineeDashboard();
            cy.get(tid(`nominee-dashboard-request-rejected-${issuerAddress}`));
          },
        );
      },
    );
  });

  it(`
    should move from "Publish Listing Page" to "Link nominee" step 
    after filling required fields from "Eto Terms" and "Investment Terms" forms
    and then submits marketing listing for review
  `, () => {
    createAndLoginNewUser({ type: "issuer", kyc: "business" }).then(
      ({ address: issuerAddress }) => {
        cy.saveLocalStorage(issuerAddress);

        fillEtoToLinkNomineeStep(issuerAddress);

        submitPreview();

        // should be in in marketing review after submitting
        cy.get(tid("eto-state-marketing_listing_in_review")).should("exist");

        // TODO: #3369 Accept marketing listing and assert that we are again in `Link Nominee` step
      },
    );
  });
});
