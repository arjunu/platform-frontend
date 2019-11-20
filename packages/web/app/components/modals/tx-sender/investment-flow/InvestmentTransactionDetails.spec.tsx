import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { wrapWithIntl } from "../../../../../test/integrationTestUtils.unsafe";
import { tid } from "../../../../../test/testUtils";
import { toEquityTokenSymbol } from "../../../../utils/opaque-types/utils";
import { InvestmentTransactionDetails } from "./InvestmentTransactionDetails";

import * as tokenIcon from "../../../../assets/img/token_icon.svg";

describe("InvestmentTransactionDetails", () => {
  const additionalData = {
    eto: {
      etoId: "0xE31EDf5FFB259CDfD701A62Fe50B9C2450726875",
      companyName: "Blokke",
      existingShareCapital: 5000,
      equityTokensPerShare: 100,
      preMoneyValuationEur: 30000000,
      sharePrice: 30000000 / (5000 * 100),
      equityTokenInfo: {
        equityTokenSymbol: toEquityTokenSymbol("QTT"),
        equityTokenImage: tokenIcon,
        equityTokenName: "Quintessence",
      },
    },
    investmentEth: "194415356251498492",
    investmentEur: "44000000000000000000",
    gasCostEth: "1200000000000000",
    equityTokens: "73",
    estimatedReward: "130133566632824437863",
    etherPriceEur: "226.319570883490141259",
    isIcbm: false,
  };

  it("should render token price, eto address, investment, transacton const, tokens, neu reward and total", () => {
    const component = mount(
      wrapWithIntl(
        <InvestmentTransactionDetails
          additionalData={additionalData}
          className={"bla"}
          txTimestamp={12345678}
        />,
      ),
    );

    expect(
      component
        .find(tid("investment-summary-token-price"))
        .find(tid("token-price"))
        .find(tid("value"))
        .text(),
    ).to.eq("0.6027");
    expect(
      component.find(tid("investment-summary-token-price")).find(tid("discount")).length,
    ).to.eq(0);
    expect(
      component
        .find(tid("investment-flow.summary.eto-address"))
        .at(0)
        .text(),
    ).to.contain(additionalData.eto.etoId);
    expect(
      component
        .find(tid("invest-modal-summary-your-investment"))
        .find(tid("euro"))
        .find(tid("value"))
        .text(),
    ).to.eq("44");
    expect(
      component
        .find(tid("invest-modal-summary-your-investment"))
        .find(tid("eth"))
        .find(tid("value"))
        .text(),
    ).to.eq("0.1944");
    expect(
      component
        .find(tid("investment-flow.summary.transaction-cost"))
        .at(0)
        .text(),
    ).to.contain("0.0012 ETH");
    expect(
      component
        .find(tid("investment-flow.summary.equity-tokens"))
        .at(0)
        .text(),
    ).to.contain("73");
    expect(
      component
        .find(tid("investment-flow.summary.neu-reward"))
        .at(0)
        .find(tid("value"))
        .text(),
    ).to.contain("130.1335");
    expect(
      component
        .find(tid("investment-flow.summary.transaction-value"))
        .find(tid("total-cost-euro"))
        .find(tid("value"))
        .text(),
    ).to.contain("44.27");
    expect(
      component
        .find(tid("investment-flow.summary.transaction-value"))
        .find(tid("total-cost-eth"))
        .find(tid("value"))
        .text(),
    ).to.contain("0.1956");

    component.unmount();
  });

  it("should render token price with discount", () => {
    const component = mount(
      wrapWithIntl(
        <InvestmentTransactionDetails
          additionalData={{ ...additionalData, equityTokens: "85" }}
          className={"bla"}
          txTimestamp={12345678}
        />,
      ),
    );

    expect(
      component
        .find(tid("investment-summary-token-price"))
        .find(tid("token-price"))
        .find(tid("value"))
        .text(),
    ).to.eq("0.5176");
    expect(
      component
        .find(tid("investment-summary-token-price"))
        .find(tid("discount"))
        .at(0)
        .text(),
    ).to.eq("14");

    component.unmount();
  });
});
