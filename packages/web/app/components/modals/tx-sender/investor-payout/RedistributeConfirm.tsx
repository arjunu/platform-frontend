import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { Button, ButtonArrowRight, EButtonLayout } from "../../../shared/buttons";
import { Message } from "../../message/Message";

import redistributeIcon from "../../../../assets/img/redistribute.svg";

interface IDispatchProps {
  confirm: () => void;
  deny: () => void;
}

type IProps = IDispatchProps;

const InvestorRedistributePayoutConfirmLayout: React.FunctionComponent<IProps> = ({
  deny,
  confirm,
}) => (
  <Message
    image={<img src={redistributeIcon} alt="" className="mb-3" />}
    title={<FormattedMessage id="investor-payout.redistribute.confirm.title" />}
    text={<FormattedMessage id="investor-payout.redistribute.confirm.text" />}
  >
    <Button onClick={deny} layout={EButtonLayout.GHOST}>
      <FormattedMessage id="investor-payout.redistribute.confirm.deny" />
    </Button>
    <ButtonArrowRight onClick={confirm} data-test-id="investor-payout.redistribute-confirm.confirm">
      <FormattedMessage id="investor-payout.redistribute.confirm.confirm" />
    </ButtonArrowRight>
  </Message>
);

const InvestorRedistributePayoutConfirm = appConnect<{}, IDispatchProps>({
  dispatchToProps: dispatch => ({
    confirm: () => dispatch(actions.txSender.txSenderAcceptDraft()),
    deny: () => dispatch(actions.txSender.txSenderHideModal()),
  }),
})(InvestorRedistributePayoutConfirmLayout);

export { InvestorRedistributePayoutConfirm, InvestorRedistributePayoutConfirmLayout };
