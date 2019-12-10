import { invariant } from "@neufund/shared"
import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import * as styles from "./ProgressBarSimple.module.scss";

interface IExternalProps {
  progress: number;
}

const ProgressBarSimple: React.FunctionComponent<IExternalProps & CommonHtmlProps> = ({
  progress = 0,
  className,
}) => {
  invariant(progress <= 100, "Progress could not be higher than 100%");
  invariant(progress >= 0, "Progress could not be lower than 0%");

  return (
    <div
      className={cn(styles.progress, className)}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className={styles.progressValue} style={{ width: `${progress}%` }} />
    </div>
  );
};

export { ProgressBarSimple };
