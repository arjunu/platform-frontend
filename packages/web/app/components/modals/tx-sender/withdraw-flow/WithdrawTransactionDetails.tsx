import * as cn from "classnames";
import * as React from "react";
import { FormattedDate, FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../../config/externalRoutes";
import { ETransactionErrorType } from "../../../../modules/tx/sender/reducer";
import { ETxSenderType, TAdditionalDataByType } from "../../../../modules/tx/types";
import {
  toFixedPrecisionAmountEth,
  toFixedPrecisionAmountEur,
  toFixedPrecisionGasCostEth,
  toFixedPrecisionGasCostEur,
} from "../../../../modules/tx/user-flow/withdraw/utils";
import { CommonHtmlProps } from "../../../../types";
import { addBigNumbers } from "../../../../utils/BigNumberUtils";
import { ErrorAlert } from "../../../shared/Alerts";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../shared/formatters/utils";
import { EtherscanTxLink } from "../../../shared/links/EtherscanLink";
import { ExternalLink } from "../../../shared/links/ExternalLink";
import {
  ESize,
  ETextPosition,
  ETheme,
  MoneySuiteWidget,
  StaticMoneyWidget,
} from "../../../shared/MoneySuiteWidget/MoneySuiteWidget";
import {
  ESize as ETransactionDataSize,
  ETheme as ETransactionDataTheme,
  TransactionData,
} from "../../../shared/TransactionData";
import { DataRow, DataRowSeparator } from "../shared/DataRow";
import { TxStatusLabel } from "../shared/TxStatusLabel";
import { ETxStatus } from "../types";
import { EthTotalFormField } from "./withdraw/EtherTotalFormField/EtherTotalFormField";

import * as ethIcon from "../../../../assets/img/eth_icon.svg";
import * as styles from "./Withdraw.module.scss";

interface IExternalProps {
  additionalData: TAdditionalDataByType<ETxSenderType.WITHDRAW>;
  status?: ETxStatus;
  txHash?: string;
  walletAddress: string;
  txTimestamp?: number;
  blockId?: number;
  error?: ETransactionErrorType;
  isMined?: boolean;
  gasCost: string;
  gasCostEur: string;
}

type TComponentProps = IExternalProps & CommonHtmlProps;

const transactionFeeWidget = (cost: string, costEur: string) =>
  cost === toFixedPrecisionGasCostEth("0") ? (
    <StaticMoneyWidget
      icon={ethIcon}
      upperText="< 0.0001 ETH"
      lowerText="< 0.0001 EUR"
      theme={ETheme.BLACK}
      size={ESize.MEDIUM}
      data-test-id="modals.tx-sender.withdraw-flow.summary.cost"
      textPosition={ETextPosition.RIGHT}
    />
  ) : (
    <MoneySuiteWidget
      currency={ECurrency.ETH}
      largeNumber={cost}
      value={costEur}
      currencyTotal={ECurrency.EUR}
      inputFormat={ENumberInputFormat.FLOAT}
      data-test-id="modals.tx-sender.withdraw-flow.summary.cost"
      theme={ETheme.BLACK}
      size={ESize.MEDIUM}
      textPosition={ETextPosition.RIGHT}
      outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS_ROUND_UP}
      icon={ethIcon}
      useTildeSign={true}
    />
  );

const WithdrawTransactionDetails: React.FunctionComponent<TComponentProps> = ({
  additionalData,
  walletAddress,
  status,
  txHash,
  blockId,
  txTimestamp,
  error,
  isMined,
  gasCost,
  gasCostEur,
}) => {
  // These rounding settings are taken as per verbal request
  const gasCostAsViewed = toFixedPrecisionGasCostEth(gasCost);
  const gasCostAsViewedEur = toFixedPrecisionGasCostEur(gasCostEur);
  const amountAsViewed = toFixedPrecisionAmountEth(additionalData.amount);
  const amountAsViewedEur = toFixedPrecisionAmountEur(additionalData.amountEur);
  const total = addBigNumbers([gasCostAsViewed, amountAsViewed]);
  const totalEur = addBigNumbers([gasCostAsViewedEur, amountAsViewedEur]);

  return (
    <>
      {status && (
        <>
          <DataRow
            className={cn({ [styles.noSpacing]: !!blockId })}
            caption={<FormattedMessage id="modal.sent-eth.transaction-status" />}
            value={<TxStatusLabel status={status} />}
            noOverflow={true}
          />
          {blockId && (
            <DataRow
              className={styles.withSpacing}
              value={
                <span className={styles.block}>
                  <FormattedMessage id="modal.sent-eth.block" values={{ blockId }} />
                </span>
              }
            />
          )}

          {error && (
            <ErrorAlert>
              {isMined ? (
                <FormattedMessage
                  id="withdraw-flow.error.mined"
                  values={{
                    supportDesk: (
                      <ExternalLink href={externalRoutes.neufundSupportHome}>
                        <FormattedMessage id="withdraw-flow.support-link" />
                      </ExternalLink>
                    ),
                  }}
                />
              ) : (
                <FormattedMessage
                  id="withdraw-flow.error.not-mined"
                  values={{
                    supportDesk: (
                      <ExternalLink href={externalRoutes.neufundSupportHome}>
                        <FormattedMessage id="withdraw-flow.support-link" />
                      </ExternalLink>
                    ),
                  }}
                />
              )}
            </ErrorAlert>
          )}

          {txTimestamp && (
            <DataRow
              data-test-id="timestamp-row.timestamp"
              caption={<FormattedMessage id="modal.sent-eth.timestamp" />}
              value={
                <TransactionData
                  top={<FormattedRelative value={txTimestamp} initialNow={new Date()} />}
                  bottom={
                    <FormattedDate
                      value={txTimestamp}
                      timeZone="UTC"
                      timeZoneName="short"
                      year="numeric"
                      month="short"
                      day="numeric"
                      hour="numeric"
                      minute="numeric"
                    />
                  }
                  size={ETransactionDataSize.MEDIUM}
                  theme={ETransactionDataTheme.BLACK_THIN}
                />
              }
            />
          )}

          {isMined && txHash && (
            <>
              <DataRow
                className={styles.withSpacing}
                caption={<FormattedMessage id="tx-monitor.details.hash-label" />}
                value={
                  <EtherscanTxLink
                    data-test-id="modals.tx-sender.withdraw-flow.tx-hash"
                    txHash={txHash}
                  />
                }
                clipboardCopyValue={txHash}
              />
              <DataRowSeparator />
            </>
          )}
        </>
      )}

      {!!error || (
        <>
          <DataRow
            className={styles.withSpacing}
            caption={<FormattedMessage id="modal.sent-eth.from-address" />}
            value={
              <EtherscanTxLink txHash={walletAddress}>
                <FormattedMessage id="modal.sent-eth.my-balance" />
              </EtherscanTxLink>
            }
            clipboardCopyValue={walletAddress}
          />
          <DataRow
            className={styles.withSpacing}
            caption={<FormattedMessage id="modal.sent-eth.to-address" />}
            value={<EtherscanTxLink txHash={additionalData.to} />}
            clipboardCopyValue={additionalData.to}
          />
          <DataRowSeparator />
        </>
      )}

      <DataRow
        className={styles.withSpacing}
        caption={<FormattedMessage id="modal.sent-eth.amount" />}
        value={
          <MoneySuiteWidget
            currency={ECurrency.ETH}
            largeNumber={error ? "0" : additionalData.amount}
            value={error ? "0" : additionalData.amountEur}
            currencyTotal={ECurrency.EUR}
            data-test-id="modals.tx-sender.withdraw-flow.summary.value"
            theme={ETheme.BLACK}
            size={ESize.MEDIUM}
            textPosition={ETextPosition.RIGHT}
            icon={ethIcon}
          />
        }
      />

      {(!error || (error && isMined)) && (
        <DataRow
          className={styles.withSpacing}
          caption={<FormattedMessage id="modal.sent-eth.transaction-fee" />}
          value={transactionFeeWidget(gasCostAsViewed, gasCostAsViewedEur)}
        />
      )}

      {!status && (
        <>
          <DataRowSeparator />
          <EthTotalFormField total={total} totalEur={totalEur} />
        </>
      )}
    </>
  );
};

export { WithdrawTransactionDetails };
