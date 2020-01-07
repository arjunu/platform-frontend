import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoInvestmentCalculatedValues } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { getEtoEurMaxTarget, getEtoEurMinTarget } from "../../../modules/eto/utils";
import { nonNullable } from "../../../utils/nonNullable";
import { Entry } from "../../shared/Entry";
import { MoneyRange } from "../../shared/formatters/MoneyRange";
import {
  EAbbreviatedNumberOutputFormat,
  ECurrency,
  ENumberInputFormat,
} from "../../shared/formatters/utils";
import { Tooltip } from "../../shared/tooltips/Tooltip";
import { ECustomTooltipTextPosition } from "../../shared/tooltips/TooltipBase";
import { ToBeAnnounced } from "../shared/ToBeAnnouncedTooltip";

type TExternalProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

type TRangeProps = {
  minTarget: string | undefined;
  maxTarget: string | undefined;
  investmentCalculatedValues: TEtoInvestmentCalculatedValues;
};

const InvestmentAmountRange: React.FunctionComponent<TRangeProps> = ({
  minTarget,
  maxTarget,
  investmentCalculatedValues,
}) => {
  const minInvestmentAmount = investmentCalculatedValues
    ? investmentCalculatedValues.minInvestmentAmount
    : undefined;
  const maxInvestmentAmount = investmentCalculatedValues
    ? investmentCalculatedValues.maxInvestmentAmount
    : undefined;

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

const InvestmentAmount: React.FunctionComponent<TExternalProps> = ({ eto }) => {
  const minTarget = getEtoEurMinTarget(eto);
  const maxTarget = getEtoEurMaxTarget(eto);

  return (
    <Entry
      label={
        minTarget ? (
          <FormattedMessage id="eto.public-view.token-terms.investment-amount-with-discount" />
        ) : (
          <FormattedMessage id="eto.public-view.token-terms.investment-amount" />
        )
      }
      value={
        <InvestmentAmountRange
          minTarget={minTarget}
          maxTarget={maxTarget}
          investmentCalculatedValues={nonNullable(eto.investmentCalculatedValues)}
        />
      }
      data-test-id="eto-public-view-investment-amount"
    />
  );
};

export { InvestmentAmount };
