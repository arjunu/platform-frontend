import {
  AUTH_INACTIVITY_THRESHOLD,
  AUTH_JWT_TIMING_THRESHOLD,
  AUTH_TOKEN_REFRESH_THRESHOLD,
} from "../../modules/auth/constants";
import { getJwtExpiryDate } from "../../utils/JWTUtils";
import {
  assertEmailChangeFlow,
  assertLanding,
  assertUserInLightWalletLoginPage,
  confirmAccessModal,
  goToDashboard,
  goToProfile,
  tid,
} from "../utils";
import { assertDashboard, assertLogin } from "../utils/assertions";
import { fillForm } from "../utils/forms";
import {
  createAndLoginNewUser,
  generateRandomEmailAddress,
  getJwtToken,
} from "../utils/userHelpers";

describe("JWT Refreshing and Escalation", () => {
  it("should logout to landing when token is initially expired", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      const jwtToken = getJwtToken();

      const jwtExpiryDate = getJwtExpiryDate(jwtToken).valueOf();
      const expectedTokenRefreshTime = jwtExpiryDate - AUTH_TOKEN_REFRESH_THRESHOLD;

      // add one seconds to get to the point after token should not be refreshed
      cy.clock(expectedTokenRefreshTime + 1, ["Date"]);

      goToDashboard(false);

      assertLanding();

      // Should remove jwt token from localstorage
      cy.wrap(null).should(() => {
        expect(getJwtToken()).to.equal(null);
      });
    });
  });

  it("should logout with session timeout message when token is already expired", () => {
    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      const now = Date.now();

      cy.clock(now, ["Date"]);

      const jwtExpiryDate = getJwtExpiryDate(getJwtToken());

      const diff = jwtExpiryDate.diff(now, "milliseconds");
      const expectedTokenRefreshTimeFromNow = diff - AUTH_TOKEN_REFRESH_THRESHOLD;

      // add one second to simulate inactivity (for e.g. hibernation)
      cy.tick(expectedTokenRefreshTimeFromNow + AUTH_JWT_TIMING_THRESHOLD + 1000);

      assertUserInLightWalletLoginPage();

      cy.get(tid("wallet-selector-session-timeout-notification")).should("exist");
    });
  });

  it("should refresh jwt token", () => {
    cy.server();
    cy.route("POST", "**/jwt/refresh").as("jwtRefresh");

    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      const now = Date.now();

      cy.clock(now, ["Date"]);

      const jwtToken = getJwtToken();

      const jwtExpiryDate = getJwtExpiryDate(jwtToken);

      const diff = jwtExpiryDate.diff(now, "milliseconds");

      const expectedTokenRefreshTimeFromNow = diff - AUTH_TOKEN_REFRESH_THRESHOLD;

      cy.tick(expectedTokenRefreshTimeFromNow + 1);

      cy.wait("@jwtRefresh");

      // Should refresh jwt token in localstorage
      cy.wrap(jwtToken).should(token => {
        expect(token).to.not.equal(getJwtToken());
      });
    });
  });

  it("should not refresh jwt token after logging out due to inactivity", () => {
    cy.server();

    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToDashboard();

      const jwtToken = getJwtToken();

      const jwtExpiryDate = getJwtExpiryDate(jwtToken);

      let now = Date.now();

      // simulate inactivity logout
      cy.clock(now);

      cy.tick(AUTH_INACTIVITY_THRESHOLD / 2);
      now += AUTH_INACTIVITY_THRESHOLD / 2;

      assertDashboard();

      cy.tick(AUTH_INACTIVITY_THRESHOLD);
      now += AUTH_INACTIVITY_THRESHOLD;

      assertLogin();

      cy.route({
        method: "POST",
        url: "**/jwt/refresh",
      }).as("jwtRefresh");

      const diff = jwtExpiryDate.diff(now, "milliseconds");

      const expectedTokenRefreshTimeFromNow = diff - AUTH_TOKEN_REFRESH_THRESHOLD;

      cy.tick(expectedTokenRefreshTimeFromNow + 1);

      // should not try refresh jwt token after inactivity logout
      cy.requestsCount("jwtRefresh").should("equal", 0);
    });
  });

  it("should escalate jwt token with new permissions", () => {
    cy.server();
    cy.route("POST", "**/jwt/create").as("jwtEscalate");

    createAndLoginNewUser({ type: "investor" }).then(() => {
      goToProfile();

      assertEmailChangeFlow();

      const jwtToken = getJwtToken();

      fillForm({
        email: generateRandomEmailAddress(),
        "verify-email-widget-form-submit": { type: "submit" },
      });

      confirmAccessModal();

      // Should send current jwt during escalation to preserve existing permissions
      cy.wait("@jwtEscalate").should((xhr: Cypress.WaitXHR) => {
        expect(xhr.request.headers.authorization).to.equal(`Bearer ${jwtToken}`);
      });

      // Should refresh jwt localstorage
      cy.wrap(jwtToken).should(token => {
        expect(token).to.not.equal(getJwtToken());
      });
    });
  });
});
