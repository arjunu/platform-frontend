import BigNumber from "bignumber.js";
import * as React from "react";

import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { getInvestmentCalculatedPercentage } from "../../../modules/eto/utils";
import { nonNullable } from "../../../utils/nonNullable";
import { ProgressBarSimple } from "../../shared/ProgressBarSimple";

type TExternalProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

const InvestmentProgress: React.FunctionComponent<TExternalProps> = ({ eto }) => {
  const currentInvestmentProgressPercentage = nonNullable(getInvestmentCalculatedPercentage(eto));

  const progressBn = new BigNumber(currentInvestmentProgressPercentage);
  const progress = progressBn.greaterThan("100") ? "100" : progressBn.toString();

  return <ProgressBarSimple progress={progress} />;
};

export { InvestmentProgress };
