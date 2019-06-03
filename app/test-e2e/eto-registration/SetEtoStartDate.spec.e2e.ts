import * as moment from "moment";

import { appRoutes } from "../../components/appRoutes";
import { utcTime, weekdayUTC } from "../../components/shared/utils";
import { closeModal, confirmAccessModal } from "../utils";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe.skip("Eto start date setup", () => {
  // TODO: Enable E2E test
  it("sets the date", () => {
    loginFixtureAccount("ISSUER_SETUP", {
      kyc: "business",
    }).then(() => {
      const newStartDate = moment
        .utc()
        .startOf("day")
        .add(20, "days")
        .add(5, "minute");

      // Happy path
      cy.visit(appRoutes.dashboard)
        .get(tid("eto-settings-start-date-open-date-picker"))
        .click()
        .get(tid("eto-settings-start-date-input"))
        .clear({ force: true })
        .type(newStartDate.format("MM/DD/YYYY HH:mm"), { force: true })
        .get(tid("eto-settings-start-date-confirm"))
        .click()
        .get(tid("set-eto-date-summary-time-to-eto"))
        .should($e => {
          expect($e.text()).to.match(/^(19|20) days, \d\d? hour(s?)/);
        })
        .get(tid("set-eto-date-summary-confirm-button"))
        .click();

      confirmAccessModal();

      cy.get(tid("modals.shared.tx-success.modal"));

      closeModal();

      cy.get(tid("eto-settings-display-start-date-utc"))
        .should($e =>
          expect($e.text()).to.be.equal(
            `${weekdayUTC(newStartDate.toDate())}, ${utcTime(newStartDate.toDate())}`,
          ),
        )
        .get(tid("eto-settings-start-date-open-date-picker"))
        .should("be.enabled");

      // should not be allowed to set a date that is too soon
      const falseDate = newStartDate.clone().subtract(17, "days");

      cy.get(tid("eto-settings-start-date-open-date-picker"))
        .wait(5000)
        .click()
        .get(tid("eto-settings-start-date-input"))
        .clear({ force: true })
        .type(falseDate.format("MM/DD/YYYY HH:mm"), { force: true })
        .get(tid("eto-settings-start-date-confirm"))
        .should("be.disabled")
        .get(tid("form.etoStartDate.error-message"));
    });
  });
});
