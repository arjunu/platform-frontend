import * as React from "react";

import { ITxData } from "../../../lib/web3/types";
import { ETxSenderType, TSpecificTransactionState } from "../../../modules/tx/types";
import { CommonHtmlProps } from "../../../types";
import { assertNever } from "../../../utils/assertNever";
import { SetDateDetails } from "./eto-flow/SetDateDetails";
import { InvestmentTransactionDetails } from "./investment-flow/InvestmentTransactionDetails";
import { AcceptTransactionDetails } from "./investor-payout/AcceptTransactionDetails";
import { RedistributeTransactionDetails } from "./investor-payout/RedistributeTransactionDetails";
import { RefundTransactionDetails } from "./investor-refund/RefundDetails";
import { BankTransferRedeemDetails } from "./redeem/BankTransferRedeemDetails";
import { UnlockWalletTransactionDetails } from "./unlock-wallet-flow/UnlockWalletTransactionDetails";
import { UpgradeTransactionDetails } from "./upgrade-flow/UpgradeTransactionDetails.unsafe";
import { ClaimTransactionDetails } from "./user-claim/ClaimTransactionDetails";
import { WithdrawTransactionDetails } from "./withdraw-flow/WithdrawTransactionDetails";

type IProps = {
  txData?: Partial<ITxData>;
} & TSpecificTransactionState;

/**
 * Generate transaction details used inside general TxPending and TxError modals
 * @note If there are no details return `null` explicitly
 */
const TxDetails: React.FunctionComponent<IProps & CommonHtmlProps> = props => {
  // wait for transaction data
  if (!props.txData) {
    return null;
  }

  // TODO: investigate why typescript marks `txData` still as undefined after condition above
  const propsAsAny = props as any;

  const type = props.type;
  switch (type) {
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <AcceptTransactionDetails {...propsAsAny} />;
    case ETxSenderType.USER_CLAIM:
      return <ClaimTransactionDetails {...propsAsAny} />;
    case ETxSenderType.WITHDRAW:
      return <WithdrawTransactionDetails {...propsAsAny} />;
    case ETxSenderType.UPGRADE:
      return <UpgradeTransactionDetails {...propsAsAny} />;
    case ETxSenderType.UNLOCK_FUNDS:
      return <UnlockWalletTransactionDetails {...propsAsAny} />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <RedistributeTransactionDetails {...propsAsAny} />;
    case ETxSenderType.ETO_SET_DATE:
      return <SetDateDetails {...propsAsAny} />;
    case ETxSenderType.INVEST:
      return <InvestmentTransactionDetails {...propsAsAny} />;
    case ETxSenderType.NEUR_REDEEM:
      return <BankTransferRedeemDetails {...propsAsAny} />;
    case ETxSenderType.SIGN_INVESTMENT_AGREEMENT:
      return null;
    case ETxSenderType.INVESTOR_REFUND:
      return <RefundTransactionDetails {...propsAsAny} />;
    case ETxSenderType.NOMINEE_THA_SIGN:
    case ETxSenderType.NOMINEE_RAAA_SIGN:
    case ETxSenderType.NOMINEE_ISHA_SIGN:
      return null;
    default:
      return assertNever(type);
  }
};

export { TxDetails };
