import { clamp } from "lodash/fp";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, pure, withHandlers, withProps } from "recompose";

import { EEtoState } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EETOStateOnChain, EEtoSubState, TEtoStartOfStates } from "../../../../modules/eto/types";
import { isComingSoon } from "../../../../modules/eto/utils";
import { Block, EBlockTheme, EndBlock, StartBlock } from "./Block";
import { DatePoint, Pointer } from "./Point";

interface IExternalProps {
  startOfStates: TEtoStartOfStates | undefined;
  // TODO: rename to onChainState
  currentState: EETOStateOnChain | undefined;
  subState: EEtoSubState | undefined;
  state: EEtoState;
}
interface IWithProps {
  preEtoStartDate: number;
  publicEtoStartDate: number;
  inSigningStartDate: number;
  inClaimStartDate: number;
  inPayoutStartDate: number;
  inRefundStartDate: number;
  preEtoWidth: number;
  publicEtoWidth: number;
  inSigningWidth: number;
  inClaimWidth: number;
  totalTimeScope: number;
  morphingTimelineWidth: number;
  isInProgressOrSuccessful: boolean;
}

interface IWithHandlers {
  calculatePointerPosition: () => number;
}

const TIMELINE_WIDTH = 1000;
const TIMELINE_HEIGHT = 106;

const TIMELINE_DYNAMIC_PAYOUT_STAGES = 4;
const TIMELINE_DYNAMIC_REFUND_STAGES = 2;

const CAMPAIGNING_BLOCK_WIDTH = 180;
const REFUND_BLOCK_WIDTH = 300;
const PAYOUT_BLOCK_WIDTH = 50;

const DEFAULT_BLOCK_PAYOUT_WIDTH =
  (TIMELINE_WIDTH - CAMPAIGNING_BLOCK_WIDTH - PAYOUT_BLOCK_WIDTH) / TIMELINE_DYNAMIC_PAYOUT_STAGES;

const DEFAULT_BLOCK_REFUND_WIDTH =
  (TIMELINE_WIDTH - CAMPAIGNING_BLOCK_WIDTH - REFUND_BLOCK_WIDTH) / TIMELINE_DYNAMIC_REFUND_STAGES;

const MORPHING_TIMELINE_PAYOUT_WIDTH =
  TIMELINE_WIDTH - CAMPAIGNING_BLOCK_WIDTH - PAYOUT_BLOCK_WIDTH; // campaining and payout are constant size
const MORPHING_TIMELINE_REFUND_WIDTH =
  TIMELINE_WIDTH - CAMPAIGNING_BLOCK_WIDTH - REFUND_BLOCK_WIDTH; // campaining and refund are constant size

const POINTER_HEIGHT = 61;
const POINTER_WIDTH = 26;
const POINTER_CAMPAIGNING_POSITION = 35;
const MAX_POINTER_POSITION = TIMELINE_WIDTH - 15;

const MINIMUM_VALID_TIME_EPOCH = 1;

const isValidDate = (date: Date | undefined): boolean =>
  !!(date && date.getTime() >= MINIMUM_VALID_TIME_EPOCH);

const getStartOfState = (state: EETOStateOnChain, startOfStates: TEtoStartOfStates | undefined) => {
  const startDate = startOfStates && startOfStates[state];

  const preEtoStartDate = startOfStates && startOfStates[EETOStateOnChain.Whitelist];
  // If `preEtoStartDate` is invalid all other dates are invalid
  return startDate && isValidDate(preEtoStartDate) ? startDate.getTime() : NaN;
};

const getSetupTitle = (state: EEtoState, subState: EEtoSubState | undefined) => {
  if (isComingSoon(state)) {
    return <FormattedMessage id="eto.status.sub-state.coming-soon" />;
  }

  if (subState === EEtoSubState.WHITELISTING) {
    return <FormattedMessage id="eto.status.sub-state.whitelisting" />;
  }

  return <FormattedMessage id="eto.status.onchain.setup" />;
};

const Setup: React.FunctionComponent<IExternalProps> = ({ state, subState }) => (
  <StartBlock
    start={0}
    end={CAMPAIGNING_BLOCK_WIDTH}
    title={getSetupTitle(state, subState)}
    theme={EBlockTheme.BLUE}
  />
);

const Whitelist: React.FunctionComponent<IWithProps> = ({ preEtoWidth, preEtoStartDate }) => (
  <Block
    start={CAMPAIGNING_BLOCK_WIDTH}
    end={preEtoWidth}
    title={<FormattedMessage id="eto.status.onchain.whitelist" />}
    theme={EBlockTheme.FLUORESCENT_BLUE}
  >
    <DatePoint date={preEtoStartDate} text={<FormattedMessage id="eto-timeline.eto-start" />} />
  </Block>
);

const Public: React.FunctionComponent<IWithProps> = ({
  preEtoWidth,
  publicEtoWidth,
  publicEtoStartDate,
}) => (
  <Block
    start={CAMPAIGNING_BLOCK_WIDTH + preEtoWidth}
    end={publicEtoWidth}
    title={<FormattedMessage id="eto.status.onchain.public" />}
    theme={EBlockTheme.GREEN}
  >
    <DatePoint date={publicEtoStartDate} />
  </Block>
);

const Signing: React.FunctionComponent<IWithProps> = ({
  preEtoWidth,
  publicEtoWidth,
  inSigningWidth,
  inSigningStartDate,
}) => (
  <Block
    start={CAMPAIGNING_BLOCK_WIDTH + preEtoWidth + publicEtoWidth}
    end={inSigningWidth}
    title={<FormattedMessage id="eto.status.onchain.signing" />}
    theme={EBlockTheme.SILVER}
  >
    <DatePoint date={inSigningStartDate} text={<FormattedMessage id="eto-timeline.eto-end" />} />
  </Block>
);

const Payout: React.FunctionComponent<IWithProps> = ({
  preEtoWidth,
  publicEtoWidth,
  inSigningWidth,
  inClaimWidth,
  inPayoutStartDate,
}) => (
  <EndBlock
    start={CAMPAIGNING_BLOCK_WIDTH + preEtoWidth + publicEtoWidth + inSigningWidth + inClaimWidth}
    end={PAYOUT_BLOCK_WIDTH}
    theme={EBlockTheme.GRAY}
  >
    <DatePoint date={inPayoutStartDate} text={<FormattedMessage id="eto-timeline.neu-payout" />} />
  </EndBlock>
);

const Refund: React.FunctionComponent<IWithProps> = ({
  preEtoWidth,
  publicEtoWidth,
  inRefundStartDate,
}) => (
  <EndBlock
    start={CAMPAIGNING_BLOCK_WIDTH + preEtoWidth + publicEtoWidth}
    end={REFUND_BLOCK_WIDTH}
    title={<FormattedMessage id="eto-timeline.claim-refund" />}
    theme={EBlockTheme.ORANGE}
  >
    <DatePoint date={inRefundStartDate} text={<FormattedMessage id="eto-timeline.eto-end" />} />
  </EndBlock>
);

const Claim: React.FunctionComponent<IWithProps> = ({
  preEtoWidth,
  publicEtoWidth,
  inSigningWidth,
  inClaimWidth,
  inClaimStartDate,
}) => (
  <Block
    start={CAMPAIGNING_BLOCK_WIDTH + preEtoWidth + publicEtoWidth + inSigningWidth}
    end={inClaimWidth}
    title={<FormattedMessage id="eto.status.onchain.claim" />}
    theme={EBlockTheme.GRAY}
  >
    <DatePoint date={inClaimStartDate} />
  </Block>
);

const EtoTimelineLayout: React.FunctionComponent<IWithProps & IWithHandlers & IExternalProps> = ({
  calculatePointerPosition,
  ...props
}) => (
  <svg viewBox={`0 0 ${TIMELINE_WIDTH} ${TIMELINE_HEIGHT}`}>
    <g transform={`translate(0 ${POINTER_HEIGHT})`}>
      <Setup {...props} />
      <Whitelist {...props} />
      <Public {...props} />

      {props.isInProgressOrSuccessful ? (
        <>
          <Signing {...props} />
          <Claim {...props} />
          <Payout {...props} />
        </>
      ) : (
        <Refund {...props} />
      )}
    </g>
    <Pointer position={calculatePointerPosition()} />
  </svg>
);

const EtoTimeline = compose<IWithProps & IWithHandlers & IExternalProps, IExternalProps>(
  // There is a lot of computation under the hood so it's better to use `pure` here
  pure,
  withProps<IWithProps, IExternalProps>(({ currentState, startOfStates }) => {
    const isInProgressOrSuccessful = currentState !== EETOStateOnChain.Refund;

    // start/end dates of phases
    const preEtoStartDate = getStartOfState(EETOStateOnChain.Whitelist, startOfStates);
    const publicEtoStartDate = getStartOfState(EETOStateOnChain.Public, startOfStates);
    const inSigningStartDate = getStartOfState(EETOStateOnChain.Signing, startOfStates);
    const inClaimStartDate = getStartOfState(EETOStateOnChain.Claim, startOfStates);
    const inPayoutStartDate = getStartOfState(EETOStateOnChain.Payout, startOfStates);
    const inRefundStartDate = getStartOfState(EETOStateOnChain.Refund, startOfStates);

    const endStateStartDate = isInProgressOrSuccessful ? inPayoutStartDate : inRefundStartDate;

    const morphingTimelineWidth = isInProgressOrSuccessful
      ? MORPHING_TIMELINE_PAYOUT_WIDTH
      : MORPHING_TIMELINE_REFUND_WIDTH;
    const defaultBlockWidth = isInProgressOrSuccessful
      ? DEFAULT_BLOCK_PAYOUT_WIDTH
      : DEFAULT_BLOCK_REFUND_WIDTH;

    // blocks sizes
    const totalTimeScope = endStateStartDate - preEtoStartDate;

    const preEtoWidth =
      ((publicEtoStartDate - preEtoStartDate) / totalTimeScope) * morphingTimelineWidth ||
      defaultBlockWidth;
    const publicEtoWidth =
      ((inSigningStartDate - publicEtoStartDate) / totalTimeScope) * morphingTimelineWidth ||
      defaultBlockWidth;
    const inSigningWidth =
      ((inClaimStartDate - inSigningStartDate) / totalTimeScope) * morphingTimelineWidth ||
      defaultBlockWidth;
    const inClaimWidth =
      ((inPayoutStartDate - inClaimStartDate) / totalTimeScope) * morphingTimelineWidth ||
      defaultBlockWidth;

    return {
      preEtoStartDate,
      publicEtoStartDate,
      inSigningStartDate,
      inClaimStartDate,
      inPayoutStartDate,
      inRefundStartDate,
      preEtoWidth,
      publicEtoWidth,
      inSigningWidth,
      inClaimWidth,
      totalTimeScope,
      morphingTimelineWidth,
      isInProgressOrSuccessful,
    };
  }),
  withHandlers<IWithProps, IWithHandlers>({
    calculatePointerPosition: ({
      preEtoStartDate,
      totalTimeScope,
      morphingTimelineWidth,
    }) => () => {
      const now = Date.now();

      const hasStartDate = !isNaN(preEtoStartDate);

      if (!hasStartDate) {
        return POINTER_CAMPAIGNING_POSITION - POINTER_WIDTH;
      }

      const calculatedPosition =
        CAMPAIGNING_BLOCK_WIDTH +
        ((now - preEtoStartDate) / totalTimeScope) * morphingTimelineWidth;

      // in case calculated position overflows timeline range use defaults
      const position = clamp(
        POINTER_CAMPAIGNING_POSITION,
        MAX_POINTER_POSITION,
        calculatedPosition,
      );

      return position - POINTER_WIDTH;
    },
  }),
)(EtoTimelineLayout);

export { EtoTimeline };
