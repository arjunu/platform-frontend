import { makeTid } from "@neufund/shared";
import * as cn from "classnames";
import * as React from "react";

import { TDataTestId } from "../../types";

import * as styles from "./TransactionData.module.scss";

enum ESize {
  HUGE = styles.huge,
  LARGE = styles.large,
  MEDIUM = styles.medium,
  NORMAL = styles.normal,
}

enum ETheme {
  BLACK = styles.black,
  SILVER = styles.silver,
  BLACK_THIN = styles.blackThin,
}

type TExternalProps = {
  bottom: React.ReactNode;
  top: React.ReactNode;
  size?: ESize;
  theme?: ETheme;
};

const TransactionData: React.FunctionComponent<TExternalProps & TDataTestId> = ({
  bottom,
  "data-test-id": dataTestId,
  size = ESize.NORMAL,
  theme = ETheme.SILVER,
  top,
}) => (
  <div className={cn(styles.transactionData, size, theme)}>
    <div className={styles.top} data-test-id={makeTid(dataTestId, "large-value")}>
      {top}
    </div>
    <div className={styles.bottom} data-test-id={makeTid(dataTestId, "value")}>
      {bottom}
    </div>
  </div>
);

export { TransactionData, ESize, ETheme };
