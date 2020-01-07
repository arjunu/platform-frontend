declare namespace Cypress {
  // noinspection TsLint
  interface Chainable<Subject = any> {
    dropFile: (fixture: string) => void;
    awaitedClick: (waitDuration?: number) => Cypress.Chainable;
    requestsCount: (alias: string) => Cypress.Chainable<number>;
    iframe: (selector: string) => Cypress.Chainable<JQuery<HTMLBodyElement>>;
    saveLocalStorage: (memoryKey?: string) => Cypress.Chainable;
    restoreLocalStorage: (memoryKey?: string) => Cypress.Chainable;
  }
}
