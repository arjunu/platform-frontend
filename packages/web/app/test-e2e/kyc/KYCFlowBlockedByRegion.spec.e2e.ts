import { assertProfile, createAndLoginNewUser, goToProfile, tid } from "../utils";

describe("KYC flow blocked by region", () => {
  it("should block kyc flow for CAMBODIA (KH) region", () => {
    cy.server();
    cy.route({
      method: "GET",
      url: "**/kyc/status",
      onRequest: xhr => {
        // set the country to prohibited one
        xhr.setRequestHeader("X-CF-IPCountry", "KH");
      },
    });

    createAndLoginNewUser({ type: "investor" });

    // should show proper message on profile

    goToProfile();
    cy.get(tid("settings.kyc-status-widget.kyc-prohibited-region")).should("exist");

    // Should block access to kyc route

    cy.visit("/kyc");
    assertProfile();
  });
});
