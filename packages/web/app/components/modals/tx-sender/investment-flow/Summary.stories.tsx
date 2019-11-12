import { storiesOf } from "@storybook/react";
import * as React from "react";

import { toEquityTokenSymbol } from "../../../../utils/opaque-types/utils";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { InvestmentSummaryComponent } from "./Summary";

import * as tokenIcon from "../../../../assets/img/token_icon.svg";

const data = {
  additionalData: {
    eto: {
      companyName: "X company",
      etoId: "0x123434562134asdf2412341234adf12341234",
      equityTokensPerShare: 0,
      sharePrice: 0,
      equityTokenInfo: {
        equityTokenSymbol: toEquityTokenSymbol("QTT"),
        equityTokenImage: tokenIcon,
        equityTokenName: "Quintessence",
      },
    },
    investmentEth: "12345678900000000000",
    investmentEur: "12345678900000000000000",
    gasCostEth: "2000000000000000",
    equityTokens: "500",
    estimatedReward: "40000000000000000000",
    etherPriceEur: "200",
    isIcbm: false,
  },
  onAccept: () => {},
  downloadAgreement: () => {},
  onChange: () => {},
};

const dataWithPriceDiscount = {
  ...data,
  additionalData: {
    ...data.additionalData,
    eto: {
      ...data.additionalData.eto,
      equityTokensPerShare: 10,
      sharePrice: 1000 / (10 * 10),
    },
  },
};

const dataWithIcbm = {
  ...data,
  additionalData: {
    ...data.additionalData,
    isIcbm: true,
    estimatedReward: "0",
  },
};

storiesOf("Investment/InvestmentSummary", module)
  .addDecorator(withModalBody())
  .add("default", () => <InvestmentSummaryComponent {...data} />)
  .add("with token price discount", () => <InvestmentSummaryComponent {...dataWithPriceDiscount} />)
  .add("isIcbm", () => <InvestmentSummaryComponent {...dataWithIcbm} />);
