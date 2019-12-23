import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../../../types";

import * as styles from "./FormStaticRadioButton.module.scss";

type TMonoToggleProps = {
  "data-test-id"?: string;
  label: TTranslatedString;
  value: string;
};

// TODO: move to layout
/* this element is is for the EtoVotingRights form to represent a selection without the choice :)) */
export const FormStaticRadioButton: React.FunctionComponent<TMonoToggleProps> = ({
  label,
  value,
  "data-test-id": dataTestId,
}) => (
  <div className={cn(styles.checkbox)}>
    <input
      className={styles.input}
      type="radio"
      value={value}
      checked={true}
      data-test-id={dataTestId}
      disabled={true}
    />
    <div className={cn(styles.indicator)} />
    {label && <div className={styles.label}>{label}</div>}
  </div>
);
