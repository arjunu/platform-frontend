import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EAdditionalValidationDataNotifications } from "../../../../../modules/tx/validator/reducer";
import { convertToUlps } from "../../../../../utils/NumberUtils";
import { withModalBody } from "../../../../../utils/storybookHelpers.unsafe";
import { WithdrawLayout } from "./Withdraw";

storiesOf("Withdraw", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <WithdrawLayout
      ethAmount={convertToUlps("124124")}
      onAccept={action("onAccept")}
      onValidateHandler={() => {}}
      notifications={[]}
      txUserFlowInputData={{ to: "0", value: "12" }}
      userFlowDetails={{
        transferAllValue: "0",
        inputValue: "0",
        inputValueEuro: "0",
        inputTo: "0",
        transactionCost: convertToUlps("0.002"),
        transactionCostEur: convertToUlps("0.2"),
        totalValue: convertToUlps("124124.002"),
        totalValueEur: convertToUlps("124124.2"),
      }}
    />
  ))
  .add("verified user", () => (
    <WithdrawLayout
      ethAmount={convertToUlps("124124")}
      onAccept={action("onAccept")}
      onValidateHandler={() => {}}
      notifications={[EAdditionalValidationDataNotifications.IS_VERIFIED_PLATFORM_USER]}
      txUserFlowInputData={{ to: "0", value: "12" }}
      userFlowDetails={{
        transferAllValue: "0",
        inputValue: "0",
        inputValueEuro: "0",
        inputTo: "0",
        transactionCost: convertToUlps("0.002"),
        transactionCostEur: convertToUlps("0.2"),
        totalValue: convertToUlps("124124.002"),
        totalValueEur: convertToUlps("124124.2"),
      }}
    />
  ))
  .add("Error", () => (
    <WithdrawLayout
      ethAmount={convertToUlps("124124")}
      onAccept={action("onAccept")}
      onValidateHandler={() => {}}
      notifications={[EAdditionalValidationDataNotifications.IS_VERIFIED_PLATFORM_USER]}
      txUserFlowInputData={{ to: "0", value: "12" }}
      userFlowDetails={{
        transferAllValue: "0",
        inputValue: "0",
        inputValueEuro: "0",
        inputTo: "0",
        transactionCost: convertToUlps("0.002"),
        transactionCostEur: convertToUlps("0.2"),
        totalValue: convertToUlps("124124.002"),
        totalValueEur: convertToUlps("124124.2"),
      }}
    />
  ));
