import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../types";

import * as styles from "./Entry.module.scss";

type TEntryExternalProps = {
  label: TTranslatedString;
  value: React.ReactNode;
};

const Entry: React.FunctionComponent<TEntryExternalProps & TDataTestId> = ({
  label,
  value,
  "data-test-id": dataTestId,
}) => (
  <div className={styles.entry}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value} data-test-id={dataTestId}>
      {value}
    </span>
  </div>
);

export { Entry };
