import * as React from "react";

import { TDataTestId } from "../../types";

import * as styles from "./LayoutWrapper.module.scss";

const LayoutWrapper: React.FunctionComponent<TDataTestId> = ({
  children,
  "data-test-id": dataTestId,
}) => (
  <div className={styles.layout} data-test-id={dataTestId}>
    {children}
  </div>
);

export { LayoutWrapper };
