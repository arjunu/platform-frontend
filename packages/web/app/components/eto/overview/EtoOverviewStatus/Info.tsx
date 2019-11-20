import * as React from "react";

import * as styles from "./Info.module.scss";

type TExternalProps = {
  children: React.ReactNode;
};

const GreyInfo: React.FunctionComponent<TExternalProps> = ({ children }) => (
  <p className={styles.greyInfo}>{children}</p>
);

export { GreyInfo };
