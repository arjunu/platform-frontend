import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { EETOStateOnChain } from "../../modules/eto/types";
import { IInvestorTicket, TETOWithInvestorTicket } from "../../modules/investor-portfolio/types";
import { withStore } from "../../utils/react-connected-components/storeDecorator.unsafe";
import { PortfolioPastInvestments } from "./PortfolioPastInvestments";

const eto = {
  ...testEto,
  contract: {
    ...testEto.contract,
    timedState: EETOStateOnChain.Payout,
  },
  investorTicket: {
    equivEurUlps: "738464183130318387747",
    rewardNmkUlps: "0",
    equityTokenInt: "2280",
    sharesInt: "228000000000000000",
    tokenPrice: "323887799618560696",
    neuRate: "0",
    amountEth: "4716210000000000000",
    amountEurUlps: "0",
    claimedOrRefunded: true,
    usedLockedAccount: true,
  } as IInvestorTicket,
} as TETOWithInvestorTicket;

storiesOf("Portfolio/PortfolioPastInvestments", module)
  .addDecorator(
    withStore({
      eto: {
        etos: { [eto.previewCode]: eto },
        contracts: { [eto.previewCode]: eto.contract },
        companies: { [eto.previewCode]: {} },
      },
    }),
  )
  .add("without past investments", () => <PortfolioPastInvestments pastInvestments={[]} />)
  .add("with past investments", () => <PortfolioPastInvestments pastInvestments={[eto]} />);
