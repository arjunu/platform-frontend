import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Confetti, EConfettiTheme } from "../../../shared/Confetti";
import { Message } from "../../message/Message";

import bankIcon from "../../../../assets/img/bank-transfer/bank.svg";

interface IDispatchProps {
  goToWallet: () => void;
}

type IProps = IDispatchProps;

const BankTransferPurchaseSuccessLayout: React.FunctionComponent<IProps> = ({ goToWallet }) => (
  <Message
    image={
      <Confetti theme={EConfettiTheme.GREEN} className="mb-3">
        <img src={bankIcon} alt="" />
      </Confetti>
    }
    text={<FormattedMessage id="bank-transfer.purchase.success.text" />}
  >
    <ButtonArrowRight
      onClick={goToWallet}
      data-test-id="bank-transfer.purchase.success.go-to-wallet"
    >
      <FormattedMessage id="menu.wallet.view" />
    </ButtonArrowRight>
  </Message>
);

const BankTransferPurchaseSuccess = appConnect<{}, IDispatchProps>({
  dispatchToProps: dispatch => ({
    goToWallet: () => dispatch(actions.routing.goToWallet()),
  }),
})(BankTransferPurchaseSuccessLayout);

export { BankTransferPurchaseSuccess, BankTransferPurchaseSuccessLayout };
