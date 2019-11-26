import * as React from "react";

import { invariant } from "../../utils/invariant";

import * as styles from "./ProgressBarSimple.module.scss";

interface IExternalProps {
  progress: number;
}

const ProgressBarSimple: React.FunctionComponent<IExternalProps> = ({ progress = 0 }) => {
  invariant(progress <= 100, "Progress could not be higher than 100%");
  invariant(progress >= 0, "Progress could not be lower than 0%");

  return (
    <div
      className={styles.progress}
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
