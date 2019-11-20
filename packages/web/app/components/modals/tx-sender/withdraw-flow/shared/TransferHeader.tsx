import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EHeadingSize, Heading } from "../../../../shared/Heading";

import * as styles from "../Transfer.module.scss";

export type TransferLayoutHeader = {
  tokenSymbol: string;
  children: React.ReactNode;
  "data-test-id"?: string;
};

export const TransferHeader: React.FunctionComponent<TransferLayoutHeader> = ({
  tokenSymbol,
  children,
  "data-test-id": dataTestId,
}) => (
  <section className={styles.contentWrapper} data-test-id={dataTestId}>
    <Heading
      size={EHeadingSize.HUGE}
      level={4}
      className={styles.withSpacing}
      decorator={false}
      disableTransform={true}
    >
      <FormattedMessage
        id="modal.sent-eth.title"
        values={{ tokenSymbol: tokenSymbol.toUpperCase() }}
      />
    </Heading>
    {children}
  </section>
);
