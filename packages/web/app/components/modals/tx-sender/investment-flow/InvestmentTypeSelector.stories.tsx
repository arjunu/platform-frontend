import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EInvestmentType } from "../../../../modules/investment-flow/reducer";
import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { InvestmentTypeSelector, WalletSelectionData } from "./InvestmentTypeSelector";

export const wallets: WalletSelectionData[] = [
  {
    balanceEur: "32112",
    balanceEth: "30000000000000000000",
    type: EInvestmentType.ICBMEth,
    name: "ICBM Wallet",
    hasFunds: true,
    enabled: true,
  },
  {
    balanceNEuro: "45600000000000000000",
    balanceEur: "45600000000000000000",
    type: EInvestmentType.ICBMnEuro,
    name: "ICBM Wallet",
    hasFunds: true,
    enabled: true,
  },
  {
    balanceEth: "50000000000000000000",
    balanceEur: "45600000000000000000",
    type: EInvestmentType.Eth,
    name: "Eth Wallet",
    hasFunds: true,
    enabled: true,
  },
  {
    balanceNEuro: "45600000000000000000",
    balanceEur: "45600000000000000000",
    type: EInvestmentType.NEur,
    name: "nEur Wallet",
    hasFunds: true,
    enabled: true,
  },
];

storiesOf("Investment/InvestmentTypeSelector", module)
  .addDecorator(withModalBody("big"))
  .add("default", () => (
    <InvestmentTypeSelector
      wallets={wallets}
      currentType={EInvestmentType.Eth}
      onSelect={action("onSelect")}
      startUpgradeFlow={action("startUpgradeFlow")}
    />
  ))
  .add("with disabled icbm wallets", () => {
    const icbmWallets: WalletSelectionData[] = [
      {
        balanceEur: "0",
        balanceEth: "0",
        icbmBalanceEth: "32112000000000000000000",
        icbmBalanceEur: "5102275680000000000000000",
        type: EInvestmentType.ICBMEth,
        name: "ICBM Wallet",
        hasFunds: true,
        enabled: false,
      },
      {
        balanceNEuro: "0",
        balanceEur: "0",
        icbmBalanceNEuro: "45600000000000000000",
        icbmBalanceEur: "45600000000000000000",
        type: EInvestmentType.ICBMnEuro,
        name: "ICBM Wallet",
        hasFunds: true,
        enabled: false,
      },
      {
        balanceEth: "50000000000000000000",
        balanceEur: "45600000000000000000",
        type: EInvestmentType.Eth,
        name: "Eth Wallet",
        hasFunds: true,
        enabled: true,
      },
      {
        balanceNEuro: "45600000000000000000",
        balanceEur: "45600000000000000000",
        type: EInvestmentType.NEur,
        name: "nEur Wallet",
        hasFunds: true,
        enabled: true,
      },
    ];

    return (
      <InvestmentTypeSelector
        wallets={icbmWallets}
        currentType={EInvestmentType.Eth}
        onSelect={action("onSelect")}
        startUpgradeFlow={action("startUpgradeFlow")}
      />
    );
  });
