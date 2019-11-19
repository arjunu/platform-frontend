import * as React from "react";

import { ETxSenderType } from "../../../../modules/tx/types";
import { assertNever } from "../../../../utils/assertNever";
import { SetEtoDateSummary } from "../eto-flow/SetDateSummary";
import { SignInvestmentAgreementSummary } from "../eto-flow/SignInvestmentAgreementSummary";
import { InvestmentSummary } from "../investment-flow/Summary";
import { InvestorAcceptPayoutSummary } from "../investor-payout/AcceptSummary";
import { InvestorRedistributePayoutSummary } from "../investor-payout/RedistributeSummary";
import { RefundSummary } from "../investor-refund/RefundSummary";
import { SignNomineeAgreementSummary } from "../nominee/sign-agreement/SignAgreementSummary";
import { SignNomineeISHASummary } from "../nominee/sign-isha/SignISHASummary";
import { BankTransferRedeemSummary } from "../redeem/BankTransferRedeemSummary";
import { UnlockWalletSummary } from "../unlock-wallet-flow/Summary.unsafe";
import { UpgradeSummary } from "../upgrade-flow/Summary.unsafe";
import { UserClaimSummary } from "../user-claim/Summary";
import { TransferSummary } from "../withdraw-flow/Summary/TransferSummary/TransferSummary";

type TExternalProps = { type: ETxSenderType };

const SummaryComponent: React.FunctionComponent<TExternalProps> = ({ type }) => {
  switch (type) {
    case ETxSenderType.INVEST:
      return <InvestmentSummary />;
    case ETxSenderType.ETO_SET_DATE:
      return <SetEtoDateSummary />;
    case ETxSenderType.UPGRADE:
      return <UpgradeSummary />;
    case ETxSenderType.USER_CLAIM:
      return <UserClaimSummary />;
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <InvestorAcceptPayoutSummary />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <InvestorRedistributePayoutSummary />;
    case ETxSenderType.UNLOCK_FUNDS:
      return <UnlockWalletSummary />;
    case ETxSenderType.NEUR_REDEEM:
      return <BankTransferRedeemSummary />;
    case ETxSenderType.SIGN_INVESTMENT_AGREEMENT:
      return <SignInvestmentAgreementSummary />;
    case ETxSenderType.INVESTOR_REFUND:
      return <RefundSummary />;
    case ETxSenderType.NOMINEE_THA_SIGN:
    case ETxSenderType.NOMINEE_RAAA_SIGN:
      return <SignNomineeAgreementSummary />;
    case ETxSenderType.NOMINEE_ISHA_SIGN:
      return <SignNomineeISHASummary />;
    case ETxSenderType.TRANSFER_TOKENS:
    case ETxSenderType.WITHDRAW:
      return <TransferSummary />;
    default:
      return assertNever(type, "Unknown Transaction Type");
  }
};

export { SummaryComponent };
