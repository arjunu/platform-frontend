import * as React from "react";

import { EWhitelistingState } from "../../../../../modules/bookbuilding-flow/utils";
import { CounterWidget } from "../CounterWidget";
import {
  connectCampaigningActivatedWidget,
  TComponentProps,
} from "./connectCampaigningActivatedWidget";
import { StartDateNotSet } from "./StartDateNotSet";
import { WhitelistingActive } from "./WhitelistingActive";
import { WhitelistingLimitReached } from "./WhitelistingLimitReached";
import { WhitelistingNotActive } from "./WhitelistingNotActive";
import { WhitelistingSuspended } from "./WhitelistingSuspended";

const CampaigningActivatedWidgetLayout: React.FunctionComponent<TComponentProps> = ({
  investorsLimit,
  pledgedAmount,
  investorsCount,
  isInvestor,
  etoId,
  minPledge,
  maxPledge,
  nextState,
  countdownDate,
  keyQuoteFounder,
  pledge,
  isVerifiedInvestor,
  whitelistingState,
}) => {
  switch (whitelistingState) {
    case EWhitelistingState.ACTIVE:
      return (
        <WhitelistingActive
          investorsLimit={investorsLimit}
          isInvestor={isInvestor}
          etoId={etoId}
          minPledge={minPledge}
          maxPledge={maxPledge}
          pledge={pledge}
          isVerifiedInvestor={isVerifiedInvestor}
          investorsCount={investorsCount}
          pledgedAmount={pledgedAmount}
        />
      );
    case EWhitelistingState.LIMIT_REACHED:
      return (
        <>
          <WhitelistingLimitReached
            isPledgedByUser={!!pledge}
            pledgedAmount={pledgedAmount}
            investorsCount={investorsCount}
          />
          {countdownDate ? (
            <CounterWidget endDate={countdownDate} awaitedState={nextState} etoId={etoId} />
          ) : (
            <StartDateNotSet nextState={nextState} />
          )}
        </>
      );
    case EWhitelistingState.SUSPENDED:
    case EWhitelistingState.STOPPED:
      return (
        <>
          <WhitelistingSuspended
            isPledgedByUser={!!pledge}
            pledgedAmount={pledgedAmount}
            investorsCount={investorsCount}
          />
          {countdownDate ? (
            <CounterWidget endDate={countdownDate} awaitedState={nextState} etoId={etoId} />
          ) : (
            <StartDateNotSet nextState={nextState} />
          )}
        </>
      );
    case EWhitelistingState.NOT_ACTIVE:
    default:
      return <WhitelistingNotActive keyQuoteFounder={keyQuoteFounder} />;
  }
};

const CampaigningActivatedWidget = connectCampaigningActivatedWidget(
  CampaigningActivatedWidgetLayout,
);

export { CampaigningActivatedWidget, CampaigningActivatedWidgetLayout };
