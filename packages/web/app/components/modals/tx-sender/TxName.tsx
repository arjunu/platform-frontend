import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ETxSenderType } from "../../../modules/tx/types";
import { assertNever } from "../../../utils/assertNever";

interface IProps {
  type: ETxSenderType;
}

/**
 * Generate transaction name used for title inside general TxPending and TxError modals
 */
const TxName: React.FunctionComponent<IProps> = ({ type }) => {
  switch (type) {
    case ETxSenderType.WITHDRAW:
      return <FormattedMessage id="withdraw-flow.name" />;
    case ETxSenderType.INVESTOR_ACCEPT_PAYOUT:
      return <FormattedMessage id="investor-payout.accept.name" />;
    case ETxSenderType.INVESTOR_REDISTRIBUTE_PAYOUT:
      return <FormattedMessage id="investor-payout.redistribute.name" />;
    case ETxSenderType.USER_CLAIM:
      return <FormattedMessage id="modals.tx-sender.user-claim.title" />;
    case ETxSenderType.UNLOCK_FUNDS:
      return <FormattedMessage id="unlock-funds-flow.title" />;
    case ETxSenderType.ETO_SET_DATE:
      return <FormattedMessage id="eto.settings.eto-start-date.title" />;
    case ETxSenderType.INVEST:
      return <FormattedMessage id="investment-flow.title" />;
    case ETxSenderType.NEUR_REDEEM:
      return <FormattedMessage id="bank-transfer.redeem.title" />;
    case ETxSenderType.SIGN_INVESTMENT_AGREEMENT:
      return <FormattedMessage id="investment-agreement.title" />;
    case ETxSenderType.UPGRADE:
      return <FormattedMessage id="upgrade-flow.title" />;
    case ETxSenderType.INVESTOR_REFUND:
      return <FormattedMessage id="user-refund-flow.title" />;
    case ETxSenderType.NOMINEE_THA_SIGN:
      return <FormattedMessage id="nominee-sign-tha.title" />;
    case ETxSenderType.NOMINEE_RAAA_SIGN:
      return <FormattedMessage id="nominee-sign-raaa.title" />;
    case ETxSenderType.NOMINEE_ISHA_SIGN:
      return <FormattedMessage id="nominee-sign-isha.title" />;
    default:
      return assertNever(type);
  }
};

export { TxName };
