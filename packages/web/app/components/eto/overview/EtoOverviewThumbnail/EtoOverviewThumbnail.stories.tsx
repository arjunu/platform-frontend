import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../../../test/fixtures";
import { Q18 } from "../../../../config/constants";
import { TMockEto } from "../../../../data/etoCompanies";
import { EEtoState } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IBookBuildingStats } from "../../../../lib/api/eto/EtoPledgeApi.interfaces.unsafe";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContract,
} from "../../../../modules/eto/types";
import { ICalculatedContribution } from "../../../../modules/investor-portfolio/types";
import { toEquityTokenSymbol } from "../../../../utils/opaque-types/utils";
import { withStore } from "../../../../utils/storeDecorator.unsafe";
import { withMockedDate } from "../../../../utils/storybookHelpers.unsafe";
import { EtoOverviewThumbnail } from "./EtoOverviewThumbnail";

import * as icbmThumbnail from "../../../../assets/img/eto_offers/investment_thumbnails_icbm_capital_raise.png";

const rootEto: TEtoWithCompanyAndContract = {
  ...testEto,
  preMoneyValuationEur: 10000,
  existingShareCapital: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
  maxPledges: 100,
  maxTicketEur: 1000,
  minTicketEur: 1,
  equityTokenName: "TokenName",
  equityTokenSymbol: toEquityTokenSymbol("TKN"),
};

// 2018-11-16T05:03:56.000Z
// Fri Nov 23 2018 06:03:56 GMT+0100
const dummyNow = new Date("2018-10-16T05:03:56+00:00");

const withEto = ({
  eto,
  bookbuildingStats,
  calculatedContributions,
}: {
  eto: TEtoWithCompanyAndContract;
  bookbuildingStats?: IBookBuildingStats;
  calculatedContributions?: ICalculatedContribution;
}) =>
  withStore({
    eto: {
      etos: { [eto.previewCode]: eto },
      companies: { [eto.companyId]: eto.company },
      contracts: { [eto.previewCode]: eto.contract },
    },
    bookBuildingFlow: bookbuildingStats && {
      bookbuildingStats: {
        [eto.etoId]: bookbuildingStats,
      },
    },
    investorTickets: calculatedContributions && {
      calculatedContributions: {
        [eto.etoId]: calculatedContributions,
      },
    },
  })(() => <EtoOverviewThumbnail eto={eto} />);

storiesOf("ETO/EtoOverviewThumbnail", module)
  .addDecorator(withMockedDate(dummyNow))
  .add("coming soon (mock)", () => {
    const mockedEto: TMockEto = {
      brandName: "ICBM Capital Raise",
      url: "https://commit.neufund.org",
      companyPreviewCardBanner: icbmThumbnail,
      id: "icbm",
      categories: ["Technology", "Blockchain"],
      keyQuoteFounder:
        "More than a thousand investors participated in Neufund’s first fundraise in 2017.",
    };

    return <EtoOverviewThumbnail mockedEto={mockedEto} />;
  })
  .add("successful (mock)", () => {
    const mockedEto: TMockEto = {
      brandName: "ICBM Capital Raise",
      url: "https://commit.neufund.org",
      companyPreviewCardBanner: icbmThumbnail,
      totalAmount: Q18.mul("12500000").toString(),
      id: "icbm",
      categories: ["Technology", "Blockchain"],
      keyQuoteFounder:
        "More than a thousand investors participated in Neufund’s first fundraise in 2017.",
    };

    return <EtoOverviewThumbnail mockedEto={mockedEto} />;
  })
  .add("coming soon", () => {
    const eto = {
      ...rootEto,
      state: EEtoState.PREVIEW,
    };

    return withEto({ eto });
  })
  .add("whitelisting (not active)", () => {
    const eto = {
      ...rootEto,
      subState: EEtoSubState.CAMPAIGNING,
      isBookbuilding: false,
      canEnableBookbuilding: true,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Setup,
      },
    };

    return withEto({ eto });
  })
  .add("whitelisting (active)", () => {
    const eto = {
      ...rootEto,
      subState: EEtoSubState.WHITELISTING,
      isBookbuilding: true,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Setup,
      },
    };

    const bookbuildingStats = {
      pledgedAmount: 100000,
      investorsCount: 40,
    };

    return withEto({ eto, bookbuildingStats });
  })
  .add("whitelisting (limit reached)", () => {
    const eto = {
      ...rootEto,
      subState: EEtoSubState.WHITELISTING,
      isBookbuilding: true,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Setup,
      },
    };

    const bookbuildingStats = {
      pledgedAmount: 100000,
      investorsCount: rootEto.maxPledges,
    };

    return withEto({ eto, bookbuildingStats });
  })
  .add("whitelisting (closed)", () => {
    const eto = {
      ...rootEto,
      subState: EEtoSubState.CAMPAIGNING,
      isBookbuilding: false,
      canEnableBookbuilding: false,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Setup,
      },
    };

    const bookbuildingStats = {
      pledgedAmount: 1000000,
      investorsCount: 50,
    };

    return withEto({ eto, bookbuildingStats });
  })
  .add("countdown to presale", () => {
    const eto = {
      ...rootEto,
      subState: EEtoSubState.COUNTDOWN_TO_PRESALE,
      isBookbuilding: false,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Setup,
      },
    };

    const calculatedContributions = {
      isEligible: true,
      minTicketEurUlps: "10" + "0".repeat(18),
      maxTicketEurUlps: "10000" + "0".repeat(18),
      neuRewardUlps: "1000" + "0".repeat(18),
      equityTokenInt: "1000",
      maxCapExceeded: false,
      isWhitelisted: true,
    };
    return withEto({ eto, calculatedContributions });
  })
  .add("presale", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Whitelist,
      },
    };

    const calculatedContributions = {
      isEligible: true,
      minTicketEurUlps: "10" + "0".repeat(18),
      maxTicketEurUlps: "10000" + "0".repeat(18),
      neuRewardUlps: "1000" + "0".repeat(18),
      equityTokenInt: "1000",
      maxCapExceeded: false,
      isWhitelisted: true,
    };
    return withEto({
      eto,
      calculatedContributions,
    });
  })
  .add("countdown to public sale", () => {
    const eto = {
      ...rootEto,
      subState: EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Whitelist,
      },
    };

    return withEto({
      eto,
    });
  })
  .add("public sale", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Public,
      },
    };

    return withEto({ eto });
  })
  .add("in signing", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Signing,
      },
    };

    return withEto({ eto });
  })
  .add("claim", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Claim,
      },
    };

    return withEto({ eto });
  })
  .add("payout", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Payout,
      },
    };

    return withEto({ eto });
  })
  .add("refund", () => {
    const eto = {
      ...rootEto,
      contract: {
        ...testEto.contract!,
        timedState: EETOStateOnChain.Refund,
      },
    };

    return withEto({ eto });
  });
