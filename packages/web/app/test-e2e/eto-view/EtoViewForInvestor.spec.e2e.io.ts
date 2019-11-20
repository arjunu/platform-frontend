import { etoPublicViewByIdLinkLegacy } from "../../components/appRouteUtils";
import {
  ENumberOutputFormat,
  ERoundingMode,
  selectUnits,
} from "../../components/shared/formatters/utils";
import { ETHEREUM_ZERO_ADDRESS } from "../../config/constants";
import { EAssetType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { calcInvestmentAmount, calcShareAndTokenPrice } from "../../lib/api/eto/EtoUtils";
import {
  etoFixtureAddressByName,
  getFormattedNumber,
  getPercentage,
  getShortFormattedNumber,
  tid,
} from "../utils";
import { goToEtoPreview } from "../utils/navigation";
import { createAndLoginNewUser, getEto, loginFixtureAccount } from "../utils/userHelpers";
import { assertEtoView, getYesOrNo } from "./EtoViewUtils";

const ETO_ID = etoFixtureAddressByName("ETONoStartDate");

describe("Eto Investor View", () => {
  describe("Default account tests", () => {
    beforeEach(() =>
      createAndLoginNewUser({ type: "investor", kyc: "business", signTosAgreement: true }),
    );

    it("should load empty Eto", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
      assertEtoView(ETO_ID);
    });

    it.skip("should display correct eto investment terms", () => {
      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID));
      assertEtoView(ETO_ID);

      getEto(ETO_ID).then(etoData => {
        // EQUITY section
        cy.get(tid("eto-public-view-pre-money-valuation")).should(
          "contain",
          getFormattedNumber(
            etoData.preMoneyValuationEur.toString(),
            undefined,
            undefined,
            undefined,
            ENumberOutputFormat.INTEGER,
          ),
        );
        cy.get(tid("eto-public-view-existing-share-capital")).should(
          "contain",
          getFormattedNumber(
            etoData.existingShareCapital.toString(),
            undefined,
            undefined,
            undefined,
            ENumberOutputFormat.INTEGER,
          ),
        );

        const minimumNewSharesToIssue = getFormattedNumber(
          etoData.minimumNewSharesToIssue.toString(),
          undefined,
          undefined,
          undefined,
          ENumberOutputFormat.INTEGER,
        );
        const newSharesToIssue = getFormattedNumber(
          etoData.newSharesToIssue.toString(),
          undefined,
          undefined,
          undefined,
          ENumberOutputFormat.INTEGER,
        );

        cy.get(tid("eto-public-view-new-shares-to-issue")).should(
          "contain",
          `${minimumNewSharesToIssue}–${newSharesToIssue}`,
        );
        cy.get(tid("eto-public-view-new-shares-to-issue-in-whitelist")).should(
          "contain",
          getFormattedNumber(
            etoData.newSharesToIssueInWhitelist!.toString(),
            undefined,
            undefined,
            undefined,
            ENumberOutputFormat.INTEGER,
          ),
        );

        // Compute new share price first
        const computedNewSharePrice = etoData.preMoneyValuationEur / etoData.existingShareCapital;
        cy.get(tid("eto-public-view-new-share-price")).should(
          "contain",
          getFormattedNumber(computedNewSharePrice.toString(), ERoundingMode.DOWN, 2),
        );
        cy.get(tid("eto-public-view-whitelist-discount")).should(
          "contain",
          getPercentage(etoData.whitelistDiscountFraction!),
        );
        const { sharePrice } = calcShareAndTokenPrice(etoData);
        const { minInvestmentAmount, maxInvestmentAmount } = calcInvestmentAmount(
          etoData,
          sharePrice,
        );
        const minInvestmentAmountFormatted = getShortFormattedNumber(
          minInvestmentAmount.toString(),
        );
        const maxInvestmentAmountFormatted = getShortFormattedNumber(
          maxInvestmentAmount.toString(),
        );

        cy.get(tid("eto-public-view-investment-amount")).should(
          "contain",
          `${minInvestmentAmountFormatted}–${maxInvestmentAmountFormatted} EUR`,
        );

        // TOKEN SALE section
        cy.get(tid("eto-public-view-tokens-per-share")).should(
          "contain",
          getFormattedNumber(
            etoData.equityTokensPerShare.toString(),
            undefined,
            undefined,
            undefined,
            ENumberOutputFormat.INTEGER,
          ),
        );

        const tokenPrice = getFormattedNumber(
          (computedNewSharePrice / etoData.equityTokensPerShare).toString(),
          ERoundingMode.DOWN,
        );
        cy.get(tid("eto-public-view-token-price")).should("contain", `${tokenPrice} EUR`);

        const minTicketEur = getFormattedNumber(
          etoData.minTicketEur.toString(),
          undefined,
          undefined,
          undefined,
          ENumberOutputFormat.INTEGER,
        );
        const maxTicketEur = getFormattedNumber(
          etoData.maxTicketEur!.toString(),
          undefined,
          undefined,
          undefined,
          ENumberOutputFormat.INTEGER,
        );
        cy.get(tid("eto-public-view-ticket-size")).should(
          "contain",
          `${minTicketEur}–${maxTicketEur} EUR`,
        );
        cy.get(tid("eto-public-view-currencies")).should(
          "contain",
          etoData.currencies.map(selectUnits).join(", "),
        );
        cy.get(tid("eto-public-view-pre-eto-duration")).should(
          "contain",
          `${etoData.whitelistDurationDays} Days`,
        );
        cy.get(tid("eto-public-view-public-eto-duration")).should(
          "contain",
          `${etoData.publicDurationDays} Days`,
        );

        //
        // // TOKEN HOLDER RIGHTS section
        cy.get(tid("eto-public-view-nominee")).should(
          "contain",
          etoData.nominee ? etoData.nomineeDisplayName : "TBA",
        );
        cy.get(tid("eto-public-view-public-offer-duration")).should(
          "contain",
          etoData.signingDurationDays ? `${etoData.signingDurationDays} Days` : "TBA",
        );
        cy.get(tid("eto-public-view-token-transferability")).should(
          "contain",
          getYesOrNo(etoData.enableTransferOnSuccess, true),
        );
        const isProductSet = etoData.product.id !== ETHEREUM_ZERO_ADDRESS;

        cy.get(tid("eto-public-view-asset-type")).should(
          "contain",
          isProductSet
            ? etoData.product.assetType === EAssetType.SECURITY
              ? "Security"
              : "Investment asset"
            : "TBA",
        );
        cy.get(tid("eto-public-view-voting-rights")).should(
          "contain",
          getYesOrNo(etoData.generalVotingRule, "positive"),
        );
        cy.get(tid("eto-public-view-dividend-rights")).should(
          "contain",
          getYesOrNo(etoData.hasDividendRights, true, true),
        );
      });
    });

    it("should should tradability when transferability is set to true", () => {
      const ETO_ID_WITH_TRANSFERABILITY_ALLOWED = etoFixtureAddressByName("ETOInWhitelistState");

      cy.visit(etoPublicViewByIdLinkLegacy(ETO_ID_WITH_TRANSFERABILITY_ALLOWED));
      assertEtoView(ETO_ID_WITH_TRANSFERABILITY_ALLOWED);

      getEto(ETO_ID_WITH_TRANSFERABILITY_ALLOWED).then(etoData => {
        // TOKEN HOLDER RIGHTS section
        cy.get(tid("eto-public-view-token-transferability")).should(
          "contain",
          getYesOrNo(etoData.enableTransferOnSuccess, true),
        );
        cy.get(tid("eto-public-view-token-tradability")).should(
          "contain",
          etoData.tokenTradeableOnSuccess ? "Immediately after ETO" : "In the future",
        );
      });
    });
  });

  describe("Fixtures tests", () => {
    it.skip("coming soon state should have token terms", () => {
      loginFixtureAccount("ISSUER_PREVIEW", {
        signTosAgreement: true,
        kyc: "business",
      }).then(() => {
        goToEtoPreview();

        // This ETO has product id set so token terms should be available
        cy.get(tid("eto-public-view-token-terms")).should("exist");
      });
    });

    it("listed state should have token terms", () => {
      loginFixtureAccount("ISSUER_LISTED", {
        signTosAgreement: true,
      }).then(() => {
        goToEtoPreview();

        cy.get(tid("eto-public-view-token-terms")).should("exist");
      });
    });
  });
});
