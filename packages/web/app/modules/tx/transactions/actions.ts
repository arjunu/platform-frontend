import { createActionFactory } from "@neufund/shared";

import { createAction, createSimpleAction } from "../../actionsUtils";
import { ITokenDisbursal } from "../../investor-portfolio/types";
import { ETokenType } from "../types";

export const txTransactionsActions = {
  /* Transaction Flows */
  startWithdrawEth: () => createSimpleAction("TRANSACTIONS_START_WITHDRAW_ETH"),
  startUpgrade: (tokenType: ETokenType) => createAction("TRANSACTIONS_START_UPGRADE", tokenType),
  startInvestment: createActionFactory("TRANSACTIONS_START_INVESTMENT", (etoId: string) => ({
    etoId,
  })),
  startEtoSetDate: () => createSimpleAction("TRANSACTIONS_START_ETO_SET_DATE"),
  startUserClaim: (etoId: string) => createAction("TRANSACTIONS_START_CLAIM", etoId),
  startInvestorPayoutAccept: createActionFactory(
    "TRANSACTIONS_START_PAYOUT_ACCEPT",
    (tokensDisbursals: ReadonlyArray<ITokenDisbursal>) => ({
      tokensDisbursals,
    }),
  ),
  startInvestorPayoutRedistribute: createActionFactory(
    "TRANSACTIONS_START_PAYOUT_REDISTRIBUTE",
    (tokenDisbursals: ITokenDisbursal) => ({
      tokenDisbursals,
    }),
  ),
  startWithdrawNEuro: createActionFactory("TRANSACTIONS_START_WITHDRAW_NEUR"),
  startUnlockEtherFunds: createActionFactory("TRANSACTIONS_START_UNLOCK_ETHER_FUNDS"),
  startInvestorRefund: createActionFactory(
    "TRANSACTION_START_INVESTOR_REFUND",
    (etoId: string) => ({ etoId }),
  ),
  startNomineeTHASign: createActionFactory("TRANSACTION_START_NOMINEE_THA_SIGN"),
  startNomineeRAAASign: createActionFactory("TRANSACTION_START_NOMINEE_RAAA_SIGN"),
  startNomineeISHASign: createActionFactory("TRANSACTION_START_NOMINEE_ISHA_SIGN"),
  // Add here new custom sagas that represent flows
};
