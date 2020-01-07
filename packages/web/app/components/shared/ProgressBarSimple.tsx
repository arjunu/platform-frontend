import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";
import { invariant } from "../../utils/invariant";

import * as styles from "./ProgressBarSimple.module.scss";

interface IExternalProps {
  progress: string;
}

const ProgressBarSimple: React.FunctionComponent<IExternalProps & CommonHtmlProps> = ({
  progress = "0",
  className,
}) => {
  const valueBn = new BigNumber(progress);

  invariant(!valueBn.greaterThan("100"), "Progress could not be higher than 100%");
  invariant(!valueBn.lessThan("0"), "Progress could not be lower than 0%");

  return (
    <div
      className={cn(styles.progress, className)}
      role="progressbar"
      aria-valuenow={valueBn.toNumber()}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className={styles.progressValue} style={{ width: `${valueBn.toString()}%` }} />
    </div>
  );
};

export { ProgressBarSimple };
