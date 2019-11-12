import { get } from "lodash";

import { mockApiUrl } from "../config";
import { tid } from "../utils/selectors";

export const assertWaitForBankTransferSummary = (reference: string, timeout: number = 60000) => {
  expect(timeout, `Bank transfer summary not received in ${timeout} ms`).to.be.gt(0);
  cy.wait(1000);
  cy.request({ url: mockApiUrl + "sendgrid/session/mails", method: "GET" }).then(r => {
    if (r.status === 200) {
      const purpose = get(r, "body[0].template_vars.purpose");

      cy.log(r.body);

      if (purpose) {
        expect(purpose).to.be.eq(reference);
        return;
      }
    }
    assertWaitForBankTransferSummary(reference, timeout - 1000);
  });
};

export const assertBankAccountDetails = () => {
  cy.get(tid("wallet.bank-account.name")).contains("Account Holder Name");
  cy.get(tid("wallet.bank-account.details")).contains(/Sparkasse Berlin \(\*{16}\d{4}\)/);
};
