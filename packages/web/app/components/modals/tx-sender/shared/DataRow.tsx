import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TDataTestId } from "../../../../types";
import { CopyToClipboardButton } from "../../../shared/CopyToClipboardButton";

import * as styles from "./DataRow.module.scss";

interface IDataRowProps {
  caption?: React.ReactNode;
  value: React.ReactNode;
  clipboardCopyValue?: string;
  noOverflow?: boolean;
}

const DataRowSeparator: React.FunctionComponent = () => <hr className={styles.separator} />;

/* This is similar component to InfoRow, but it's not utilize Lists */
const DataRow: React.FunctionComponent<IDataRowProps & CommonHtmlProps & TDataTestId> = ({
  caption,
  value,
  clipboardCopyValue,
  "data-test-id": dataTestId,
  className,
  noOverflow,
}) => (
  <section className={cn(styles.section, className)}>
    <span>{caption}</span>
    <span className={cn(styles.copyToClipboard, { [styles.value]: !noOverflow })}>
      <span data-test-id={dataTestId}>{value}</span>
      {clipboardCopyValue && (
        <CopyToClipboardButton className={"ml-2"} value={clipboardCopyValue} />
      )}
    </span>
  </section>
);

export { DataRow, DataRowSeparator };
