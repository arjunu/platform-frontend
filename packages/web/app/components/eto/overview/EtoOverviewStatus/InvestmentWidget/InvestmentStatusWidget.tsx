import { nonNullable } from "@neufund/shared"
import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoState } from "../../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { InvalidETOStateError } from "../../../../../modules/eto/errors";
import { TEtoWithCompanyAndContractReadonly } from "../../../../../modules/eto/types";
import {
  getCurrentInvestmentProgressPercentage,
  getEtoEurMinTarget,
  isEtoSoftCapReached,
  isOnChain,
} from "../../../../../modules/eto/utils";
import { FormatNumber } from "../../../../shared/formatters/FormatNumber";
import { Money } from "../../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberFormat,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../../shared/formatters/utils";
import { ProgressBarSimple } from "../../../../shared/ProgressBarSimple";
import { Tooltip } from "../../../../shared/tooltips/Tooltip";
import { ECustomTooltipTextPosition } from "../../../../shared/tooltips/TooltipBase";

import * as styles from "./InvestmentStatusWidget.module.scss";

enum EInvestmentStatusSize {
  NORMAL = styles.statsWrapperNormal,
  SMALL = styles.statsWrapperSmall,
}

interface IInvestmentStatsProps {
  eto: TEtoWithCompanyAndContractReadonly;
  size?: EInvestmentStatusSize;
}

const InvestmentStatusWidget: React.FunctionComponent<IInvestmentStatsProps> = ({
  eto,
  size = EInvestmentStatusSize.NORMAL,
}) => {
  if (!isOnChain(eto)) {
    throw new InvalidETOStateError(eto.state, EEtoState.ON_CHAIN);
  }

  const investmentCalculatedValues = nonNullable(eto.investmentCalculatedValues);

  const currentProgressPercentage = getCurrentInvestmentProgressPercentage(eto);
  const isSoftCapReached = isEtoSoftCapReached(eto);
  const target = getEtoEurMinTarget(eto);
  const originalTarget = investmentCalculatedValues.minInvestmentAmount.toString();

  const totalInvestors = eto.contract.totalInvestment.totalInvestors;
  return (
    <section className={cn(size)}>
      <div className={styles.row}>
        <span className={styles.funded}>
          <FormattedMessage
            id="shared-component.eto-overview.investment-stats.funded-percentage"
            values={{
              funded: (
                <Money
                  data-test-id="investment-widget-funded-percentage"
                  value={currentProgressPercentage.toString()}
                  inputFormat={ENumberInputFormat.FLOAT}
                  outputFormat={ENumberOutputFormat.FULL}
                  valueType={ENumberFormat.PERCENTAGE}
                />
              ),
            }}
          />
        </span>
        <span>
          <FormattedMessage
            id="shared-component.eto-overview.investment-stats.total-investors"
            values={{
              totalInvestors: (
                <FormatNumber
                  data-test-id="investment-widget-investors-invested"
                  value={totalInvestors}
                  outputFormat={ENumberOutputFormat.INTEGER}
                  inputFormat={ENumberInputFormat.FLOAT}
                />
              ),
            }}
          />
        </span>
      </div>
      <ProgressBarSimple progress={isSoftCapReached ? 100 : currentProgressPercentage} />
      <div className={styles.row}>
        <span>
          <FormattedMessage
            id="shared-component.eto-overview.investment-stats.total-amount-raised"
            values={{
              amountRaised: (
                <Money
                  data-test-id="investment-widget-total-nEur-invested"
                  value={eto.contract.totalInvestment.totalEquivEurUlps}
                  inputFormat={ENumberInputFormat.ULPS}
                  valueType={ECurrency.EUR}
                  outputFormat={ENumberOutputFormat.FULL}
                />
              ),
            }}
          />
        </span>
        <span>
          <FormattedMessage
            id="shared-component.eto-overview.investment-stats.target"
            values={{
              amountRaised: (
                <Money
                  data-test-id="investment-widget-nEur-target"
                  value={target ? target : originalTarget}
                  inputFormat={ENumberInputFormat.FLOAT}
                  valueType={ECurrency.EUR}
                  outputFormat={ENumberOutputFormat.FULL}
                />
              ),
            }}
          />
          {target && (
            <Tooltip
              textPosition={ECustomTooltipTextPosition.LEFT}
              content={
                <FormattedMessage
                  id="shared-component.eto-overview.investment-stats.target.tooltip"
                  values={{
                    lineBreak: <br />,
                    target: (
                      <Money
                        data-test-id="investment-widget-nEur-original-target"
                        value={originalTarget}
                        inputFormat={ENumberInputFormat.FLOAT}
                        valueType={ECurrency.EUR}
                        outputFormat={ENumberOutputFormat.FULL}
                      />
                    ),
                  }}
                />
              }
            />
          )}
        </span>
      </div>
    </section>
  );
};

export { InvestmentStatusWidget, EInvestmentStatusSize };
