const OFFLINE_HTTP_METHODS = ["GET", "POST", "PATCH", "PUT"];

let isOffline = false;

/**
 * Stubs all responses to return 500.
 * Not a proper implementation of offline mode but good enough until cypress adds support
 */
export const goOffline = () => {
  cy.server();

  OFFLINE_HTTP_METHODS.forEach(method => {
    cy.route({
      method,
      url: "*",
      response: "I'm offline",
      status: 504,
    });
  });

  isOffline = true;
};

export const goOnline = () => {
  if (!isOffline) {
    throw new Error("You need to be offline (by calling goOffline) before calling `goOnline`");
  }

  OFFLINE_HTTP_METHODS.forEach(method => {
    cy.route({
      method,
      url: "*",
    });
  });

  isOffline = false;
};
