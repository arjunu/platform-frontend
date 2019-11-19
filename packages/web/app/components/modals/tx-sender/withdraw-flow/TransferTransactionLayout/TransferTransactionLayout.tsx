import * as cn from "classnames";
import * as React from "react";
import { FormattedDate, FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../../../config/externalRoutes";
import {
  toFixedPrecisionGasCostEth,
  toFixedPrecisionGasCostEur,
} from "../../../../../modules/tx/user-flow/transfer/utils";
import { ErrorAlert } from "../../../../shared/Alerts";
import { Button } from "../../../../shared/buttons";
import { EtherscanTxLink } from "../../../../shared/links/EtherscanLink";
import { ExternalLink } from "../../../../shared/links/ExternalLink";
import {
  ESize as ETransactionDataSize,
  ETheme as ETransactionDataTheme,
  TransactionData,
} from "../../../../shared/TransactionData";
import { DataRow, DataRowSeparator } from "../../shared/DataRow";
import { TxStatusLabel } from "../../shared/TxStatusLabel";
import { TokenAmount } from "../shared/TokenAmount";
import { TransferHeader } from "../shared/TransferHeader";
import { TransactionFeeWidget } from "./TransactionFeeWidget";
import { TTransferTransactionProps } from "./TransferTransaction";

import * as styles from "../Transfer.module.scss";

const TimeStampComponents: React.FunctionComponent<{ txTimestamp: number }> = ({ txTimestamp }) => (
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
);

const AddressFields: React.FunctionComponent<{
  fromAddress: string;
  toAddress: string;
}> = ({ fromAddress, toAddress }) => (
  <>
    <DataRow
      className={styles.withSpacing}
      caption={<FormattedMessage id="modal.sent-eth.from-address" />}
      value={
        <EtherscanTxLink txHash={fromAddress}>
          <FormattedMessage id="modal.sent-eth.my-balance" />
        </EtherscanTxLink>
      }
      clipboardCopyValue={fromAddress}
    />
    <DataRow
      className={styles.withSpacing}
      caption={<FormattedMessage id="modal.sent-eth.to-address" />}
      value={<EtherscanTxLink txHash={toAddress} />}
      clipboardCopyValue={toAddress}
    />
    <DataRowSeparator />
  </>
);
const TxErrorMessage: React.FunctionComponent<{
  isMined: boolean | undefined;
}> = ({ isMined }) => (
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
);

export const TransferTransactionWrapperLayout: React.FunctionComponent<
  TTransferTransactionProps
> = ({
  error,
  additionalData,
  txHash,
  blockId,
  walletAddress,
  txTimestamp,
  gasCost,
  gasCostEur,
  onClick,
  tokenImage,
  tokenSymbol,
  tokenDecimals,
  status,
  isMined,
  amountCaption,
  "data-test-id": dataTestId,
}) => (
  <TransferHeader tokenSymbol={tokenSymbol} data-test-id={dataTestId}>
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

    {error && <TxErrorMessage isMined={isMined} />}

    {txTimestamp && (
      <>
        <TimeStampComponents txTimestamp={txTimestamp} /> {!isMined && <DataRowSeparator />}
      </>
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

    {!error && <AddressFields fromAddress={walletAddress} toAddress={additionalData.to} />}
    <TokenAmount
      amount={error ? "0" : additionalData.amount}
      amountEur={error ? "0" : additionalData.amountEur}
      tokenImage={tokenImage}
      tokenSymbol={tokenSymbol}
      tokenDecimals={tokenDecimals}
      caption={amountCaption}
    />
    {(!error || (error && isMined)) && (
      <DataRow
        className={styles.withSpacing}
        caption={<FormattedMessage id="modal.sent-eth.transaction-fee" />}
        value={
          <TransactionFeeWidget
            cost={toFixedPrecisionGasCostEth(gasCost)}
            costEur={toFixedPrecisionGasCostEur(gasCostEur)}
          />
        }
      />
    )}
    <section className="text-center">
      <Button onClick={onClick} data-test-id="modals.tx-sender.withdraw-flow.summary.accept">
        <FormattedMessage id="withdraw-flow.close-summary" />
      </Button>
    </section>
  </TransferHeader>
);
