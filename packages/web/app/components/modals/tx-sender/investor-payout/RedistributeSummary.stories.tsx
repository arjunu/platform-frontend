import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ITokenDisbursal } from "../../../../modules/investor-portfolio/types";
import { EthereumAddressWithChecksum } from "../../../../utils/opaque-types/types";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { ECurrency } from "../../../shared/formatters/utils";
import { InvestorRedistributePayoutSummaryLayout } from "./RedistributeSummary";

const ethTokenDisbursal: ITokenDisbursal = {
  token: ECurrency.ETH,
  amountToBeClaimed: "6.582870355588135389497e+21",
  totalDisbursedAmount: "9.7154607e+22",
  timeToFirstDisbursalRecycle: 1675401473000,
};

const nEurTokenDisbursal: ITokenDisbursal = {
  token: ECurrency.EUR_TOKEN,
  amountToBeClaimed: "6.582870355588135389497e+21",
  totalDisbursedAmount: "9.7154607e+22",
  timeToFirstDisbursalRecycle: 1675401473000,
};

storiesOf("InvestorPayout/RedistributeSummary", module)
  .addDecorator(withModalBody())
  .add("ETH", () => (
    <InvestorRedistributePayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      additionalData={{ tokenDisbursals: ethTokenDisbursal }}
      onAccept={action("onAccept")}
    />
  ))
  .add("nEur", () => (
    <InvestorRedistributePayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      additionalData={{ tokenDisbursals: nEurTokenDisbursal }}
      onAccept={action("onAccept")}
    />
  ));
