import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoWithCompanyAndContractReadonly } from "../../../../../../modules/eto/types";
import { getEtoEurMaxTarget, getEtoEurMinTarget } from "../../../../../../modules/eto/utils";
import { MoneyRange } from "../../../../../shared/formatters/MoneyRange";
import {
  EAbbreviatedNumberOutputFormat,
  ECurrency,
  ENumberInputFormat,
} from "../../../../../shared/formatters/utils";
import { Tooltip } from "../../../../../shared/tooltips/Tooltip";
import { ECustomTooltipTextPosition } from "../../../../../shared/tooltips/TooltipBase";
import { ToBeAnnounced } from "../../../../shared/ToBeAnnouncedTooltip";

type TExternalProps = {
  etoData: TEtoWithCompanyAndContractReadonly;
};

const InvestmentAmount: React.FunctionComponent<TExternalProps> = ({ etoData }) => {
  const minInvestmentAmount = etoData.investmentCalculatedValues
    ? etoData.investmentCalculatedValues.minInvestmentAmount
    : undefined;
  const maxInvestmentAmount = etoData.investmentCalculatedValues
    ? etoData.investmentCalculatedValues.maxInvestmentAmount
    : undefined;

  const minTarget = getEtoEurMinTarget(etoData);
  const maxTarget = getEtoEurMaxTarget(etoData);

  const minTargetAmount = minTarget ? minTarget : minInvestmentAmount;
  const maxTargetAmount = maxTarget ? maxTarget : maxInvestmentAmount;

  return (
    <>
      <MoneyRange
        valueFrom={minTargetAmount ? minTargetAmount.toString() : undefined}
        valueUpto={maxTargetAmount ? maxTargetAmount.toString() : undefined}
        inputFormat={ENumberInputFormat.FLOAT}
        valueType={ECurrency.EUR}
        outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
        defaultValue={<ToBeAnnounced />}
      />
      {minTarget && minInvestmentAmount && maxInvestmentAmount && (
        <Tooltip
          textPosition={ECustomTooltipTextPosition.LEFT}
          content={
            <FormattedMessage
              id="shared-component.eto-overview.investment-stats.target.tooltip"
              values={{
                lineBreak: <br />,
                target: (
                  <MoneyRange
                    valueFrom={minInvestmentAmount.toString()}
                    valueUpto={maxInvestmentAmount.toString()}
                    inputFormat={ENumberInputFormat.FLOAT}
                    valueType={ECurrency.EUR}
                    outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
                  />
                ),
              }}
            />
          }
        />
      )}
    </>
  );
};

export { InvestmentAmount };
