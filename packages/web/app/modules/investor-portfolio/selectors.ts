import BigNumber from "bignumber.js";
import { isArray } from "lodash/fp";
import { createSelector } from "reselect";

import { shouldShowToken } from "../../components/portfolio/utils";
import { ECurrency } from "../../components/shared/formatters/utils";
import { Q18 } from "../../config/constants";
import { TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IAppState } from "../../store";
import { compareBigNumbers, subtractBigNumbers } from "../../utils/BigNumberUtils";
import { isZero } from "../../utils/NumberUtils";
import { selectMyPledge } from "../bookbuilding-flow/selectors";
import {
  selectEtoById,
  selectEtoOnChainStateById,
  selectEtos,
  selectEtoWithCompanyAndContractById,
  selectTokenData,
} from "../eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../eto/types";
import { isOnChain } from "../eto/utils";
import { selectLockedWalletConnected } from "../wallet/selectors";
import {
  ICalculatedContribution,
  IInvestorTicket,
  TETOWithInvestorTicket,
  TETOWithTokenData,
  TTokensPersonalDiscount,
} from "./types";
import {
  getRequiredIncomingAmount,
  isPastInvestment,
  MIMIMUM_RETAIL_TICKET_EUR_ULPS,
} from "./utils";

const selectInvestorTicketsState = (state: IAppState) => state.investorTickets;

export const selectInvestorTicket = (
  state: IAppState,
  etoId: string,
): IInvestorTicket | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.investorEtoTickets[etoId];
};

export const selectHasInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  const investmentTicket = investorState.investorEtoTickets[etoId];

  if (investmentTicket) {
    // equivEurUlps is set to zero when investor didn't invest
    return !new BigNumber(investmentTicket.equivEurUlps).isZero();
  }

  return false;
};

export const selectEtoWithInvestorTickets = (
  state: IAppState,
): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtos(state);
  if (etos) {
    return etos
      .filter(isOnChain)
      .filter(eto => eto.contract.timedState !== EETOStateOnChain.Setup)
      .filter(eto => selectHasInvestorTicket(state, eto.etoId))
      .map(eto => ({
        ...eto,
        investorTicket: selectInvestorTicket(state, eto.etoId)!,
      }));
  }

  return undefined;
};

export const selectMyAssets = (state: IAppState): TEtoWithCompanyAndContract[] | undefined => {
  const etos = selectEtos(state);

  if (etos) {
    return etos.filter(
      eto =>
        eto.contract &&
        [EETOStateOnChain.Payout, EETOStateOnChain.Claim].includes(eto.contract.timedState),
    );
  }

  return undefined;
};

export const selectMyPendingAssets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    return etos.filter(eto => !eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};

export const selectMyInvestorTicketByEtoId = (
  state: IAppState,
  etoId: string,
): TETOWithInvestorTicket | undefined => {
  const eto = selectEtoWithCompanyAndContractById(state, etoId);
  const investorTicket = selectInvestorTicket(state, etoId);

  if (investorTicket && eto) {
    return { ...eto, investorTicket };
  }

  return undefined;
};

export const selectCalculatedContribution = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return (
    investorState.calculatedContributions[etoId] ||
    selectInitialCalculatedContribution(state, etoId)
  );
};

export const selectInitialCalculatedContribution = (
  state: IAppState,
  etoId: string,
): ICalculatedContribution | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.initialCalculatedContributions[etoId];
};

export const selectInitialMaxCapExceeded = (state: IAppState, etoId: string): boolean => {
  const initialCalculatedContribution = selectInitialCalculatedContribution(state, etoId);

  if (!initialCalculatedContribution) return false;

  return initialCalculatedContribution.maxCapExceeded;
};

export const selectEquityTokenCountByEtoId = (state: IAppState, etoId: string) => {
  const contrib = selectCalculatedContribution(state, etoId);
  return contrib && contrib.equityTokenInt.toString();
};

export const selectCalculatedEtoTicketSizesUlpsById = (state: IAppState, etoId: string) => {
  const eto = selectEtoById(state, etoId);
  const contrib = selectCalculatedContribution(state, etoId);
  const investorTicket = selectInvestorTicket(state, etoId);
  const zero = new BigNumber("0");

  // todo: check if contrib is ever undefined and simplify this condition
  let min =
    (contrib && new BigNumber(contrib.minTicketEurUlps)) ||
    (eto && Q18.mul(eto.minTicketEur.toString() || zero));
  let max =
    (contrib && new BigNumber(contrib.maxTicketEurUlps)) ||
    (eto && eto.maxTicketEur && Q18.mul(eto.maxTicketEur.toString() || zero));

  if (min && max) {
    if (eto && investorTicket) {
      // todo: replace with price taken from smart contract
      const tokenPrice = eto.investmentCalculatedValues!.sharePrice / eto.equityTokensPerShare;
      max = BigNumber.max(max.sub(investorTicket.equivEurUlps), "0");
      // when already invested, you can invest less than minimum ticket however we set this value
      // to more than just one token: we have official retail min ticket at 10 EUR so use it
      min = BigNumber.max(
        min.sub(investorTicket.equivEurUlps),
        Q18.mul(tokenPrice.toString()),
        MIMIMUM_RETAIL_TICKET_EUR_ULPS,
      );
      // however it cannot be more than max
      min = BigNumber.min(max, min);
    }

    return {
      minTicketEurUlps: min,
      maxTicketEurUlps: max,
    };
  }

  return undefined;
};

export const selectNeuRewardUlpsByEtoId = (state: IAppState, etoId: string) => {
  const contrib = selectCalculatedContribution(state, etoId);
  return contrib && contrib.neuRewardUlps.toString();
};

export const selectIsWhitelisted = (state: IAppState, etoId: string) => {
  const contrib = selectInitialCalculatedContribution(state, etoId);

  return !!contrib && contrib.isWhitelisted;
};

export const selectIsEligibleToPreEto = (state: IAppState, etoId: string) => {
  const isLockedWalletConnected = selectLockedWalletConnected(state);
  // pre-sale eligibility depends on bookbuilding participation which will eventually be committed to smart contract
  const isOnBookbuildingWhitelist = selectMyPledge(state, etoId) !== undefined;

  return isLockedWalletConnected || isOnBookbuildingWhitelist;
};

export const selectShouldShowWhitelistDiscount = (state: IAppState, eto: TEtoSpecsData) => {
  const isPreEto =
    (selectEtoOnChainStateById(state, eto.etoId) || EETOStateOnChain.Setup) <=
    EETOStateOnChain.Whitelist;
  const isEligibleToPreEto = selectIsEligibleToPreEto(state, eto.etoId);
  return Boolean(eto.whitelistDiscountFraction && isEligibleToPreEto && isPreEto);
};

export const selectShouldShowPublicDiscount = (state: IAppState, eto: TEtoSpecsData) =>
  Boolean(!selectShouldShowWhitelistDiscount(state, eto) && eto.publicDiscountFraction);

export const selectTokensDisbursalIsLoading = (state: IAppState) =>
  state.investorTickets.tokensDisbursal.loading;

export const selectTokensDisbursalNotInitialized = (state: IAppState) =>
  state.investorTickets.tokensDisbursal.data === undefined;

export const selectTokensDisbursalError = (state: IAppState) =>
  state.investorTickets.tokensDisbursal.error;

/**
 * Selects tokens disbursal with `amountToBeClaimed` greater than zero
 */
export const selectTokensDisbursal = createSelector(
  selectInvestorTicketsState,
  investorTickets => {
    if (isArray(investorTickets.tokensDisbursal.data)) {
      return investorTickets.tokensDisbursal.data
        .filter(d => !isZero(d.amountToBeClaimed))
        .filter(t => shouldShowToken(t.token, t.amountToBeClaimed));
    }
    return investorTickets.tokensDisbursal.data;
  },
);

export const selectPayoutAvailable = (state: IAppState) => {
  const tokenDisbursal = selectTokensDisbursal(state);
  return !!tokenDisbursal && tokenDisbursal.length > 0;
};

export const selectMyAssetsWithTokenData = (state: IAppState): TETOWithTokenData[] | undefined => {
  const myAsssets = selectMyAssets(state);
  if (myAsssets) {
    return myAsssets.map((asset: TEtoWithCompanyAndContract) => ({
      ...asset,
      tokenData: selectTokenData(state.eto, asset.previewCode)!,
    }));
  }

  return undefined;
};

export const selectIsIncomingPayoutLoading = (state: IAppState): boolean =>
  state.investorTickets.incomingPayouts.loading;

export const selectIsIncomingPayoutNotInitialized = (state: IAppState): boolean =>
  state.investorTickets.incomingPayouts.data === undefined;

export const selectIncomingPayoutError = (state: IAppState): boolean =>
  state.investorTickets.incomingPayouts.error;

export const selectEtherTokenIncomingPayout = (state: IAppState): string => {
  const incomingPayout = state.investorTickets.incomingPayouts.data;

  if (incomingPayout) {
    const minimumEtherTokenAmount = getRequiredIncomingAmount(ECurrency.ETH);
    const etherToken = incomingPayout.etherTokenIncomingPayoutValue;

    return compareBigNumbers(etherToken, minimumEtherTokenAmount) >= 0 ? etherToken : "0";
  }
  return "0";
};

export const selectEuroTokenIncomingPayout = (state: IAppState): string => {
  const incomingPayout = state.investorTickets.incomingPayouts.data;

  if (incomingPayout) {
    const minimumEuroTokenAmount = getRequiredIncomingAmount(ECurrency.EUR_TOKEN);
    const euroToken = incomingPayout.euroTokenIncomingPayoutValue;

    return compareBigNumbers(euroToken, minimumEuroTokenAmount) >= 0 ? euroToken : "0";
  }
  return "0";
};

export const selectIncomingPayoutSnapshotDate = (state: IAppState): number | undefined => {
  const incomingPayout = state.investorTickets.incomingPayouts.data;
  return incomingPayout && incomingPayout.snapshotDate;
};

export const selectIsIncomingPayoutPending = (state: IAppState): boolean => {
  const etherToken = selectEtherTokenIncomingPayout(state);
  const euroToken = selectEuroTokenIncomingPayout(state);

  const minimumEtherTokenAmount = getRequiredIncomingAmount(ECurrency.ETH);
  const minimumEuroTokenAmount = getRequiredIncomingAmount(ECurrency.EUR_TOKEN);

  // Incoming payout is more or equals 1ETH
  const shouldShowEtherToken = compareBigNumbers(etherToken, minimumEtherTokenAmount) >= 0;
  // Incoming payout is more or equals 100nEUR
  const shouldShowEuroToken = compareBigNumbers(euroToken, minimumEuroTokenAmount) >= 0;

  return shouldShowEtherToken || shouldShowEuroToken;
};

export const selectPastInvestments = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    return etos
      .filter(eto => eto.investorTicket.claimedOrRefunded)
      .filter(eto => isPastInvestment(eto.contract!.timedState))
      .sort((left, right) => {
        const timedStateLeft = left.contract!.timedState;
        const timedStateRight = right.contract!.timedState;

        const investmentDateLeft = new Date(
          left.contract!.startOfStates[timedStateLeft]!,
        ).getTime();
        const investmentDateRight = new Date(
          left.contract!.startOfStates[timedStateRight]!,
        ).getTime();

        // sort by date DESC
        return investmentDateRight - investmentDateLeft;
      });
  }

  return undefined;
};

export const selectTokenPersonalDiscount = (
  state: IAppState,
  etoId: string,
): TTokensPersonalDiscount | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.tokensPersonalDiscounts[etoId];
};

export const selectPersonalDiscount = createSelector(
  selectInvestorTicket,
  selectTokenPersonalDiscount,
  (investorTicket, tokenPersonalDiscount) => {
    if (investorTicket && tokenPersonalDiscount) {
      const whitelistDiscountAmountLeft = subtractBigNumbers([
        tokenPersonalDiscount.whitelistDiscountAmountEurUlps,
        investorTicket.equivEurUlps,
      ]);

      return {
        whitelistDiscountAmountLeft,
        whitelistDiscountUlps: tokenPersonalDiscount.whitelistDiscountUlps,
        whitelistDiscountFrac: tokenPersonalDiscount.whitelistDiscountFrac,
      };
    }

    return undefined;
  },
);
