import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
  EAdditionalValidationDataNotifications,
  EValidationState,
} from "../../../../../../modules/tx/validator/reducer";
import { convertToUlps } from "../../../../../../utils/NumberUtils";
import { toEquityTokenSymbol } from "../../../../../../utils/opaque-types/utils";
import { withModalBody } from "../../../../../../utils/storybookHelpers.unsafe";
import { TransferLayout } from "./TransferLayout";

const props = {
  tokenAmount: convertToUlps("124124"),
  onAccept: action("onAccept"),
  onValidateHandler: action("onValidateHandler"),
  notifications: [],
  txUserFlowInputData: { to: "0", value: "12" },
  userFlowDetails: {
    transferAllValue: "0",
    inputValue: "0",
    inputValueEuro: "0",
    inputTo: "0",
    transactionCost: convertToUlps("0.002"),
    transactionCostEur: convertToUlps("0.2"),
    totalValue: convertToUlps("124124.002"),
    totalValueEur: convertToUlps("124124.2"),
  },
  tokenSymbol: toEquityTokenSymbol("ETH"),
  tokenImage: "../../../../../assets/img/eth_icon.svg",
  tokenDecimals: 18,
};

storiesOf("Organisms/Transfer", module)
  .addDecorator(withModalBody())
  .add("default", () => <TransferLayout {...props} />)
  .add("verified user", () => (
    <TransferLayout
      {...props}
      notifications={[EAdditionalValidationDataNotifications.IS_VERIFIED_PLATFORM_USER]}
    />
  ))
  .add("error", () => (
    <TransferLayout {...props} validationState={EValidationState.IS_NOT_ACCEPTING_ETHER} />
  ));
