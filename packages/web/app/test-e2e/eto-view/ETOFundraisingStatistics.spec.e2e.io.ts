import { externalRoutes } from "../../config/externalRoutes";
import { withParams } from "../../utils/withParams";
import { etoFixtureAddressByName, tid } from "../utils";
import { loginFixtureAccount } from "../utils/userHelpers";
import { goToEtoViewById } from "./EtoViewUtils";

const assertFundraisingStatisticsTab = (etoId: string) => {
  goToEtoViewById(etoId);

  cy.get(tid("eto.public-view.fundraising-statistics")).click();
  cy.get(tid("eto.public-view.fundraising-statistics.iframe"))
    .and("have.attr", "src")
    .and("include", withParams(externalRoutes.icoMonitorStats, { etoId }));
};

const assertNoFundraisingStatisticsTab = (etoId: string) => {
  goToEtoViewById(etoId);

  cy.get(tid("eto.public-view.fundraising-statistics")).should("not.exist");
};

describe("ETO Fundraising Statistics", () => {
  describe("ETO Investor view", () => {
    it("should show fundraising statistics for whitelisted investor", () => {
      const etoId = etoFixtureAddressByName("ETOInWhitelistState");

      loginFixtureAccount("INV_ETH_EUR_ICBM_M_HAS_KYC", {
        kyc: "business",
        signTosAgreement: true,
        clearPendingTransactions: true,
      });

      assertFundraisingStatisticsTab(etoId);
    });

    it("should not show fundraising statistics for not whitelisted investor", () => {
      const etoId = etoFixtureAddressByName("ETOInWhitelistState");

      loginFixtureAccount("INV_EMPTY_HAS_KYC", {
        kyc: "business",
        signTosAgreement: true,
        clearPendingTransactions: true,
      });

      assertNoFundraisingStatisticsTab(etoId);
    });
  });
  describe("ETO Public view", () => {
    it("should not show statistics for ETO in Setup state", () => {
      const etoId = etoFixtureAddressByName("ETOInSetupState");

      assertNoFundraisingStatisticsTab(etoId);
    });

    it("should not show statistics for ETO in Whitelist state", () => {
      const etoId = etoFixtureAddressByName("ETOInWhitelistState");

      assertNoFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Public state", () => {
      const etoId = etoFixtureAddressByName("ETOInPublicState");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Signing state", () => {
      const etoId = etoFixtureAddressByName("ETOInSigningState");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Claim state", () => {
      const etoId = etoFixtureAddressByName("ETOInClaimState");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Payout state", () => {
      const etoId = etoFixtureAddressByName("ETOInPayoutState");

      assertFundraisingStatisticsTab(etoId);
    });

    it("should show statistics for ETO in Refund state", () => {
      const etoId = etoFixtureAddressByName("ETOInRefundState");

      assertFundraisingStatisticsTab(etoId);
    });
  });
});
