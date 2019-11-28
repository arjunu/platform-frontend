import * as React from "react";

import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { getCurrentInvestmentProgressPercentage } from "../../../modules/eto/utils";
import { ProgressBarSimple } from "../../shared/ProgressBarSimple";

type TProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

const InvestmentProgress: React.FunctionComponent<TProps> = ({ eto }) => {
  const currentProgressPercentage = getCurrentInvestmentProgressPercentage(eto);

  return (
    <ProgressBarSimple
      progress={currentProgressPercentage > 100 ? 100 : currentProgressPercentage}
    />
  );
};

export { InvestmentProgress };
