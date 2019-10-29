import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { calcCapFraction } from "../../../../lib/api/eto/EtoUtils";
import { TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import {
  selectShouldShowPublicDiscount,
  selectShouldShowWhitelistDiscount,
} from "../../../../modules/investor-portfolio/selectors";
import { appConnect } from "../../../../store";
import { Money } from "../../../shared/formatters/Money";
import { MoneyRange } from "../../../shared/formatters/MoneyRange";
import {
  EAbbreviatedNumberOutputFormat,
  ECurrency,
  ENumberFormat,
  ENumberInputFormat,
  ENumberOutputFormat,
  EPriceFormat,
} from "../../../shared/formatters/utils";
import { ToBeAnnounced, ToBeAnnouncedTooltip } from "../../shared/ToBeAnnouncedTooltip";

import * as styles from "./EtoOverviewStatus.module.scss";

interface IStateProps {
  tokenPrice: number | undefined;
  showWhitelistDiscount: boolean;
  showPublicDiscount: boolean;
  computedMaxCapPercent: number;
  computedMinCapPercent: number;
}

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

const EtoStatsLayout: React.FunctionComponent<IStateProps & IExternalProps> = ({
  eto,
  tokenPrice,
  showWhitelistDiscount,
  showPublicDiscount,
  computedMaxCapPercent,
  computedMinCapPercent,
}) => (
  <div className={cn(styles.etoStatsWrapper, styles.groupWrapper)}>
    <div className={styles.group}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview-status.key-investment-terms" />
        {":"}
      </span>
    </div>
    <div className={styles.group}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview-status.pre-money-valuation" />
      </span>
      <span className={styles.value}>
        <Money
          className={styles.value}
          value={eto.preMoneyValuationEur ? eto.preMoneyValuationEur.toString() : undefined}
          inputFormat={ENumberInputFormat.FLOAT}
          valueType={ECurrency.EUR}
          outputFormat={ENumberOutputFormat.INTEGER}
          defaultValue={<ToBeAnnouncedTooltip />}
        />
      </span>
    </div>
    <div className={styles.group}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview-status.target-investment-amount" />
      </span>
      <span className={styles.value}>
        <Money
          value={
            eto.investmentCalculatedValues && eto.investmentCalculatedValues.maxInvestmentAmount
              ? eto.investmentCalculatedValues.maxInvestmentAmount.toString()
              : undefined
          }
          inputFormat={ENumberInputFormat.FLOAT}
          valueType={ECurrency.EUR}
          outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
          defaultValue={<ToBeAnnounced />}
        />
      </span>
    </div>
    <div className={styles.group}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview-status.new-shares-generated" />
      </span>
      <span className={styles.value}>
        <MoneyRange
          valueFrom={computedMinCapPercent.toString()}
          valueUpto={computedMaxCapPercent.toString()}
          inputFormat={ENumberInputFormat.FLOAT}
          outputFormat={ENumberOutputFormat.FULL}
          valueType={ENumberFormat.PERCENTAGE}
          defaultValue={<ToBeAnnounced />}
        />
      </span>
    </div>
    <div className={styles.group}>
      <span className={styles.label}>
        <FormattedMessage id="shared-component.eto-overview-status.equity-token-price" />
      </span>
      <span className={styles.value}>
        <Money
          value={tokenPrice ? tokenPrice.toString() : undefined}
          inputFormat={ENumberInputFormat.FLOAT}
          valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
          outputFormat={ENumberOutputFormat.FULL}
          defaultValue={<ToBeAnnounced />}
        />
        {showWhitelistDiscount && (
          <>
            {" ("}
            <FormattedMessage
              id="shared-component.eto-overview-status.included-discount-percentage"
              values={{ percentage: eto.whitelistDiscountFraction! * 100 }}
            />
            {")"}
          </>
        )}
        {showPublicDiscount && (
          <>
            {" ("}
            <FormattedMessage
              id="shared-component.eto-overview-status.included-discount-percentage"
              values={{ percentage: eto.publicDiscountFraction! * 100 }}
            />
            {")"}
          </>
        )}
      </span>
    </div>
  </div>
);

export const EtoStats = compose<IStateProps & IExternalProps, IExternalProps>(
  appConnect<IStateProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const etoData = props.eto;

      const showWhitelistDiscount = selectShouldShowWhitelistDiscount(state, etoData);
      const showPublicDiscount = selectShouldShowPublicDiscount(state, etoData);

      let tokenPrice;
      if (etoData.investmentCalculatedValues) {
        tokenPrice = etoData.investmentCalculatedValues.sharePrice;
        if (showWhitelistDiscount) {
          tokenPrice = etoData.investmentCalculatedValues.discountedSharePrice;
        }
        if (showPublicDiscount) {
          tokenPrice = etoData.investmentCalculatedValues.publicSharePrice;
        }
        tokenPrice = tokenPrice / etoData.equityTokensPerShare;
      }
      return {
        tokenPrice,
        showWhitelistDiscount,
        showPublicDiscount,
        ...calcCapFraction(props.eto),
      };
    },
  }),
)(EtoStatsLayout);
