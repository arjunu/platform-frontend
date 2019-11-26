import * as React from "react";

import { EquityToken } from "../../../../../utils/opaque-types/types";
import { ECurrency } from "../../../../shared/formatters/utils";
import {
  ETextPosition,
  ETheme,
  MoneySingleSuiteWidget,
  MoneySuiteWidget,
} from "../../../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { ESize } from "../../../../shared/TransactionData";
import { DataRow } from "../../shared/DataRow";

import * as styles from "../Transfer.module.scss";

export const TokenAmount: React.FunctionComponent<{
  amount: string;
  amountEur: string;
  tokenSymbol: EquityToken;
  tokenImage: string;
  tokenDecimals: number;
  caption: React.ReactNode;
}> = ({ amount, amountEur, tokenSymbol, tokenImage, tokenDecimals, caption }) => (
  <DataRow
    className={styles.withSpacing}
    caption={caption}
    value={
      tokenSymbol === ECurrency.ETH ? (
        <MoneySuiteWidget
          currency={ECurrency.ETH}
          largeNumber={amount}
          value={amountEur}
          currencyTotal={ECurrency.EUR}
          data-test-id="modals.tx-sender.withdraw-flow.summary.value"
          theme={ETheme.BLACK}
          size={ESize.MEDIUM}
          textPosition={ETextPosition.RIGHT}
          icon={tokenImage}
        />
      ) : (
        <MoneySingleSuiteWidget
          currency={tokenSymbol}
          value={amount}
          data-test-id="modals.tx-sender.withdraw-flow.summary.value.large-value"
          theme={ETheme.BLACK}
          size={ESize.MEDIUM}
          textPosition={ETextPosition.RIGHT}
          icon={tokenImage}
          decimals={tokenDecimals}
        />
      )
    }
  />
);
