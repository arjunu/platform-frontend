import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { toEquityTokenSymbol } from "../../../../../../utils/opaque-types/utils";
import { withModalBody } from "../../../../../../utils/storybookHelpers.unsafe";
import { TransferSummaryLayout } from "./TransferSummaryLayout";

import ethImage from "../../../../../../assets/img/eth_icon.svg";

const props = {
  txHash: "0xdb3c43a0cfc4e221ecb52655eab3c3b88ba521a",
  additionalData: {
    to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
    amount: "5500000000000000000",
    amountEur: "5500000000000000000",
    total: "313131232312331212",
    totalEur: "313131232312331212",
  },
  walletAddress: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  gasCost: "023",
  gasCostEur: "123",
  onAccept: action("onAccept"),
  onChange: action("onChange"),
  tokenImage: ethImage,
  tokenSymbol: toEquityTokenSymbol("ETH"),
  tokenDecimals: 18,
};

storiesOf("Withdraw/Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => <TransferSummaryLayout {...props} />);
