import { normalize } from "@neufund/shared"
import * as React from "react";

import { ProgressBarSimple } from "../../../../shared/ProgressBarSimple";

type TProps = {
  investorsCount: number;
  investorsLimit: number;
};

const WhitelistProgress: React.FunctionComponent<TProps> = ({ investorsCount, investorsLimit }) => {
  const getNormalizedValue = normalize({ min: 0, max: investorsLimit });

  const currentProgressNormalized = getNormalizedValue(investorsCount);

  const progress = currentProgressNormalized * 100;

  return <ProgressBarSimple progress={progress} />;
};

export { WhitelistProgress };
