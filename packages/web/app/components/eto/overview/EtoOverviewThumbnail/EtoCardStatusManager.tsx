import * as cn from "classnames";
import * as moment from "moment";
import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { EEtoState } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import {
  EETOStateOnChain,
  EEtoSubState,
  TEtoWithCompanyAndContract,
} from "../../../../modules/eto/types";
import { Money } from "../../../shared/formatters/Money";
import {
  EAbbreviatedNumberOutputFormat,
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
} from "../../../shared/formatters/utils";
import { getCurrentInvestmentProgressPercentage } from "../utils";
import { InvestmentStatus } from "./InvestmentStatus/InvestmentStatus";
import { Whitelist } from "./Whitelist/Whitelist";

import * as styles from "./EtoStatusManager.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContract;
}

const SuccessfulInfo: React.FunctionComponent<{ totalAmount: string }> = ({ totalAmount }) => (
  <div className={styles.successfulInfo}>
    <p className={cn(styles.successfulInfoText)}>
      <FormattedMessage id="eto-overview-thumbnail.success.successful-fundraising" />
    </p>
    <p className="mb-0">
      <FormattedMessage
        id="eto-overview-thumbnail.success.raised-amount"
        values={{
          totalAmount: (
            <Money
              value={totalAmount}
              inputFormat={ENumberInputFormat.ULPS}
              valueType={ECurrency.EUR}
              outputFormat={EAbbreviatedNumberOutputFormat.SHORT}
            />
          ),
        }}
      />
    </p>
  </div>
);

const EtoCardStatusManager = ({ eto }: IExternalProps) => {
  const state = eto.contract ? eto.contract.timedState : eto.state;

  switch (state) {
    case EEtoState.LISTED:
    case EEtoState.PROSPECTUS_APPROVED:
    case EETOStateOnChain.Setup: {
      return <Whitelist eto={eto} />;
    }

    case EETOStateOnChain.Whitelist: {
      const publicSaleStartDate = eto.contract!.startOfStates[EETOStateOnChain.Public]!;

      return (
        <>
          <InvestmentStatus eto={eto} />

          <p className={styles.info}>
            {/* user is not allowed to invest in presale */}
            {eto.subState === EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE ? (
              <FormattedMessage
                id="eto-overview-thumbnail.presale.days-to-public-sale"
                values={{ startDate: <FormattedRelative value={publicSaleStartDate} /> }}
              />
            ) : (
              <FormattedMessage id="eto-overview-thumbnail.presale.view-offer" />
            )}
          </p>
        </>
      );
    }

    case EETOStateOnChain.Public: {
      const currentProgressPercentage = getCurrentInvestmentProgressPercentage(eto);
      const endDate = eto.contract!.startOfStates[EETOStateOnChain.Signing]!;

      return (
        <>
          <InvestmentStatus eto={eto} />
          <p className={styles.info}>
            <FormattedMessage
              id="eto-overview-thumbnail.public-sale.days-left"
              values={{
                endDate: moment(new Date()).to(endDate, true),
                foundedPercentage: Math.floor(currentProgressPercentage),
              }}
            />
          </p>
        </>
      );
    }

    case EETOStateOnChain.Signing: {
      return (
        <>
          <InvestmentStatus eto={eto} />

          <p className={styles.info}>
            <FormattedMessage
              id="eto-overview-thumbnail.signing.raised-amount"
              values={{
                totalAmount: (
                  <Money
                    value={eto.contract!.totalInvestment.totalEquivEurUlps}
                    inputFormat={ENumberInputFormat.ULPS}
                    valueType={ECurrency.EUR}
                    outputFormat={ENumberOutputFormat.FULL}
                  />
                ),
              }}
            />
          </p>
        </>
      );
    }

    case EETOStateOnChain.Claim:
    case EETOStateOnChain.Payout: {
      return <SuccessfulInfo totalAmount={eto.contract!.totalInvestment.totalEquivEurUlps} />;
    }

    case EETOStateOnChain.Refund: {
      return (
        <>
          <InvestmentStatus eto={eto} />
          <p className={styles.info}>
            <FormattedMessage id="eto-overview-thumbnail.refund.claim-refund" />
          </p>
        </>
      );
    }

    case EEtoState.SUSPENDED:
      return <></>;

    default:
      throw new Error(`State (${state}) is not known. Please provide implementation.`);
  }
};

export { EtoCardStatusManager, SuccessfulInfo };
