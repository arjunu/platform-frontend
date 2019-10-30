import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../../../../modules/eto/types";
import { withMockedDate } from "../../../../utils/storybookHelpers.unsafe";
import { EtoMaxCapExceededComponent } from "./EtoMaxCapExceeded";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0x123434562134asdf2412341234adf12341234",
  preMoneyValuationEur: 10000,
  existingShareCapital: 10,
  equityTokensPerShare: 10,
  maxPledges: 500,
  maxTicketEur: 10000000,
  minTicketEur: 100,
  minimumNewSharesToIssue: 1000,
  newSharesToIssue: 3452,
  newSharesToIssueInWhitelist: 1534,
  company: {},
  contract: {
    timedState: EETOStateOnChain.Whitelist,
    totalInvestment: {
      totalInvestors: "123",
      totalTokensInt: "34520",
      totalEquivEurUlps: "12345",
    },
  },
} as TEtoWithCompanyAndContractReadonly;

storiesOf("ETO/MaxCapExceededWidget", module)
  .addDecorator(withMockedDate(new Date("1/1/2000")))
  .add("pre-eto", () => (
    <EtoMaxCapExceededComponent
      isPreEto={true}
      eto={eto}
      etherPriceEur={"100"}
      isWaitingForNextStateToStart={true}
      nextStateStartDate={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
    />
  ))
  .add("public", () => (
    <EtoMaxCapExceededComponent
      isPreEto={false}
      eto={eto}
      etherPriceEur={"100"}
      isWaitingForNextStateToStart={false}
      nextStateStartDate={new Date("+1 day")}
    />
  ));
