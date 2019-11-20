import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { ButtonArrowRight } from "../../../shared/buttons";
import { Confetti, EConfettiTheme } from "../../../shared/Confetti";
import { Message } from "../../message/Message";

import * as bankIcon from "../../../../assets/img/bank-transfer/bank.svg";

interface IDispatchProps {
  goToWallet: () => void;
}

type IProps = IDispatchProps;

const BankTransferVerifySuccessLayout: React.FunctionComponent<IProps> = ({ goToWallet }) => (
  <Message
    image={
      <Confetti theme={EConfettiTheme.GREEN} className="mb-3">
        <img src={bankIcon} alt="" className="my-4" />
      </Confetti>
    }
    text={<FormattedMessage id="bank-verification.success.text" />}
  >
    <ButtonArrowRight onClick={goToWallet} data-test-id="bank-transfer.verify.success.go-to-wallet">
      <FormattedMessage id="menu.wallet.view" />
    </ButtonArrowRight>
  </Message>
);

const BankTransferVerifySuccess = appConnect<{}, IDispatchProps>({
  dispatchToProps: dispatch => ({
    goToWallet: () => dispatch(actions.routing.goToWallet()),
  }),
})(BankTransferVerifySuccessLayout);

export { BankTransferVerifySuccess, BankTransferVerifySuccessLayout };
