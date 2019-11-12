import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ETxSenderType } from "../../../../modules/tx/types";
import { convertToUlps } from "../../../../utils/NumberUtils";
import { toEquityTokenSymbol } from "../../../../utils/opaque-types/utils";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { TxSuccessLayout } from "./TxSuccess";

import * as tokenIcon from "../../../../assets/img/token_icon.svg";

const txData: React.ComponentProps<typeof TxSuccessLayout> = {
  type: ETxSenderType.INVEST,
  additionalData: {
    eto: {
      etoId: "123",
      companyName: "Test Co",
      equityTokensPerShare: 10,
      sharePrice: 100 / (20 * 10),
      equityTokenInfo: {
        equityTokenSymbol: toEquityTokenSymbol("QTT"),
        equityTokenImage: tokenIcon,
        equityTokenName: "Quintessence",
      },
    },
    equityTokens: "211",
    estimatedReward: convertToUlps("125"),
    etherPriceEur: "2542.22",
    gasCostEth: convertToUlps("0.124"),
    investmentEth: convertToUlps("120"),
    investmentEur: convertToUlps("22506"),
    isIcbm: false,
  },
  blockId: 4623487932,
  txHash: "af908098b968d7564564362c51836",
  txData: {
    from: "0x0020d330ef4de5c07d4271e0a67e8fd67a21d523",
    gas: "0x7b0c",
    gasPrice: "0xb2d05e00",
    input: "0x00",
    to: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988",
    value: "0x8ac7230489e80000",
  },
};

storiesOf("TxSuccess", module)
  .addDecorator(withModalBody())
  .add("default", () => <TxSuccessLayout {...txData} />);
