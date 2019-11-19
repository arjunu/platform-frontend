import * as React from "react";

import { ETxSenderType } from "../../../../modules/tx/types";
import { InvestmentSuccess } from "../investment-flow/Success";
import { InvestorAcceptPayoutSuccess } from "../investor-payout/AcceptSuccess";
import { InvestorRedistributePayoutSuccess } from "../investor-payout/RedistributeSuccess";
import { SignNomineeAgreementSuccess } from "../nominee/sign-agreement/SignAgreementSuccess";
import { BankTransferRedeemSuccess } from "../redeem/BankTransferRedeemSuccess";
import { TxSuccess } from "../shared/TxSuccess";
import { UserClaimSuccess } from "../user-claim/Success";
import { TransferSuccess } from "../withdraw-flow/Success/Success";

type TExternalProps = {
  type: ETxSenderType;
  txHash: string;
  txTimestamp: number;
};

const SuccessComponent: React.FunctionComponent<TExternalProps> = props => {
  switch (props.type) {
    case ETxSenderType.INVEST:
      return <InvestmentSuccess {...props} />;
    case ETxSenderType.USER_CLAIM:
      return <UserClaimSuccess {...props} />;
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <InvestorAcceptPayoutSuccess {...props} />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <InvestorRedistributePayoutSuccess {...props} />;
    case ETxSenderType.NEUR_REDEEM:
      return <BankTransferRedeemSuccess {...props} />;
    case ETxSenderType.WITHDRAW:
    case ETxSenderType.TRANSFER_TOKENS:
      return <TransferSuccess {...props} />;
    case ETxSenderType.NOMINEE_THA_SIGN:
    case ETxSenderType.NOMINEE_RAAA_SIGN:
      return <SignNomineeAgreementSuccess />;
    default:
      return <TxSuccess {...props} />;
  }
};

export { SuccessComponent };
