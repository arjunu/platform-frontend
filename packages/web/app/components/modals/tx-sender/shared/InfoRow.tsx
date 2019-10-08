import * as cn from "classnames";
import { isString } from "lodash";
import * as React from "react";
import { ListGroupItem } from "reactstrap";

import { TDataTestId } from "../../../../types";
import { CopyToClipboardButton } from "../../../shared/CopyToClipboardButton";

import * as styles from "./InfoRow.module.scss";

type TInfoRowCopyProps = {};

type TInfoRowCommonProps = {
  caption: React.ReactNode;
  allowClipboardCopy?: boolean;
  value: React.ReactNode | string;
  clipboardCopyValue?: string;
};

const selectCopyValue = (
  value: string | React.ReactNode,
  clipboardCopyValue: string | undefined,
) => {
  if (clipboardCopyValue) {
    return clipboardCopyValue;
  }

  if (isString(value)) {
    return value;
  }

  throw new Error("Value should be string or clipboardCopyValue should be set");
};

export const InfoRow: React.FunctionComponent<
  TInfoRowCommonProps & TInfoRowCopyProps & TDataTestId
> = ({ caption, value, allowClipboardCopy, "data-test-id": dataTestId, clipboardCopyValue }) => (
  <ListGroupItem className={styles.infoRow}>
    <div className={styles.infoCell}>{caption}</div>
    <div className={styles.infoCell}>
      <span data-test-id={dataTestId}>{value}</span>
      {allowClipboardCopy && (
        <CopyToClipboardButton
          className={cn(styles.copyToClipboard, "ml-2")}
          value={selectCopyValue(value, clipboardCopyValue)}
        />
      )}
    </div>
  </ListGroupItem>
);
