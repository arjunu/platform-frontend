import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { toFormValueEth } from "../../../../../../modules/tx/user-flow/withdraw/utils";
import { ButtonInline } from "../../../../../shared/buttons";

import * as styles from "../../Withdraw.module.scss";

type TExternalProps = {
  disabled: boolean;
  setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
  ethAmount: string;
};

const TransferAllButton: React.FunctionComponent<TExternalProps> = ({
  ethAmount,
  setFieldValue,
  disabled,
}) => (
  <section className={cn(styles.withSpacing, "text-right small")}>
    <ButtonInline
      data-test-id="modals.tx-sender.withdraw-flow.withdraw-component.whole-balance"
      disabled={disabled}
      onClick={() => {
        setFieldValue("value", ethAmount ? toFormValueEth(ethAmount) : "0", true);
      }}
    >
      <FormattedMessage id="modal.sent-eth.whole-balance" />
    </ButtonInline>
  </section>
);

export { TransferAllButton };
