import * as React from "react";

import { normalize } from "../../../../../utils/NumberUtils";
import {
  PercentageIndicatorBar,
  TProgressBarProps,
} from "../../../../shared/PercentageIndicatorBar";

import * as styles from "./WhitelistProgress.module.scss";

type TProps = {
  investorsCount: number;
  investorsLimit: number;
};

const WhitelistProgress: React.FunctionComponent<TProps> = ({ investorsCount, investorsLimit }) => {
  const getNormalizedValue = normalize({ min: 0, max: investorsLimit });

  const currentProgressNormalized = getNormalizedValue(investorsCount);

  const progress: TProgressBarProps[] = [
    { progress: Math.ceil(currentProgressNormalized * 100), theme: "green" },
  ];

  return (
    <PercentageIndicatorBar
      className={styles.investmentProgress}
      layout="narrow"
      progress={progress}
      svgGroupStyle={{ transform: `translate(0 4)` }}
      svgHeight={40}
    />
  );
};

export { WhitelistProgress };
