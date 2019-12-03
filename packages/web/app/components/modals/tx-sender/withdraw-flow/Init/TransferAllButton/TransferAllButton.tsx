import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { toFormValue } from "../../../../../../modules/tx/user-flow/transfer/utils";
import { ButtonInline } from "../../../../../shared/buttons";

import * as styles from "../../Transfer.module.scss";

type TExternalProps = {
  disabled: boolean;
  setFieldValue: (field: string, value: string, shouldValidate?: boolean) => void;
  amount: string;
  decimals: number;
};

const TransferAllButton: React.FunctionComponent<TExternalProps> = ({
  amount,
  setFieldValue,
  disabled,
  decimals,
}) => (
  <section className={cn(styles.withSpacing, "text-right small")}>
    <ButtonInline
      data-test-id="modals.tx-sender.transfer-flow.transfer-component.whole-balance"
      disabled={disabled}
      onClick={() => {
        setFieldValue("value", amount ? toFormValue(amount, decimals) : "0", true);
      }}
    >
      <FormattedMessage id="modal.sent-eth.whole-balance" />
    </ButtonInline>
  </section>
);

export { TransferAllButton };
