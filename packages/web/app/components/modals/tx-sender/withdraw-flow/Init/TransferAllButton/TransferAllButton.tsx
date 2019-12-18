import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { toFormValue } from "../../../../../../modules/tx/user-flow/transfer/utils";
import { ButtonInline } from "../../../../../shared/buttons";

import * as styles from "../../Transfer.module.scss";

type TExternalProps = {
  disabled: boolean;
  onClick: (amount: string) => void;
  amount: string;
  decimals: number;
};

const TransferAllButton: React.FunctionComponent<TExternalProps> = ({
  amount,
  onClick,
  disabled,
  decimals,
}) => (
  <section className={cn(styles.withSpacing, "text-right small")}>
    <ButtonInline
      data-test-id="modals.tx-sender.transfer-flow.transfer-component.whole-balance"
      disabled={disabled}
      onClick={() => {
        onClick(amount ? toFormValue(amount, decimals) : "0");
      }}
    >
      <FormattedMessage id="modal.sent-eth.whole-balance" />
    </ButtonInline>
  </section>
);

export { TransferAllButton };
