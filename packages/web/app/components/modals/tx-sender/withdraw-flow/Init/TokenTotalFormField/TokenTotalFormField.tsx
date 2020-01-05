import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../../shared/formatters/utils";
import {
  ESize,
  ETextPosition,
  ETheme,
  MoneySuiteWidget,
} from "../../../../../shared/MoneySuiteWidget/MoneySuiteWidget";
import { DataRow } from "../../../shared/DataRow";

import ethIcon from "../../../../../../assets/img/eth_icon.svg";
import * as styles from "../../Transfer.module.scss";

const TokenTotalFormField: React.FunctionComponent<{
  total: string;
  totalEur: string;
}> = ({ total, totalEur }) => (
  <DataRow
    className={cn(styles.sectionBig, styles.withSpacing)}
    caption={<FormattedMessage id="modal.sent-eth.total" />}
    value={
      <MoneySuiteWidget
        currency={ECurrency.ETH}
        largeNumber={total}
        value={totalEur}
        currencyTotal={ECurrency.EUR}
        data-test-id="modals.tx-sender.withdraw-flow.summary.total"
        theme={ETheme.BLACK}
        size={ESize.HUGE}
        textPosition={ETextPosition.RIGHT}
        outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
        icon={ethIcon}
        inputFormat={ENumberInputFormat.FLOAT}
      />
    }
  />
);

export { TokenTotalFormField };
