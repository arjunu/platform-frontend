import * as React from "react";

import { ETxSenderType } from "../../../../modules/tx/types";
import { LoadingIndicator } from "../../../shared/loading-indicator";
import { InvestmentSelection } from "../investment-flow/Investment";
import { InvestorRedistributePayoutConfirm } from "../investor-payout/RedistributeConfirm";
import { BankTransferRedeemInit } from "../redeem/BankTransferRedeemInit";
import { TransferTokensInit } from "../withdraw-flow/Init/TokenTransferInit";
import { WithdrawInit } from "../withdraw-flow/Init/WithdrawInit";

type TExternalProps = { type: ETxSenderType };

const InitComponent: React.FunctionComponent<TExternalProps> = ({ type }) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSelection />;
    case ETxSenderType.WITHDRAW:
      return <WithdrawInit />;
    case ETxSenderType.TRANSFER_TOKENS:
      return <TransferTokensInit />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <InvestorRedistributePayoutConfirm />;
    case ETxSenderType.NEUR_REDEEM:
      return <BankTransferRedeemInit />;
    default:
      return <LoadingIndicator />;
  }
};

export { InitComponent };
