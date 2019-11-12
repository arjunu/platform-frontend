import { AppReducer } from "../../store";
import { DeepReadonly, Dictionary } from "../../types";
import { actions } from "../actions";
import {
  ICalculatedContribution,
  IIncomingPayouts,
  IInvestorTicket,
  TTokenDisbursalData,
  TTokensPersonalDiscount,
} from "./types";

export interface IInvestorTicketsState {
  investorEtoTickets: Dictionary<IInvestorTicket | undefined>;
  calculatedContributions: Dictionary<ICalculatedContribution | undefined>;
  initialCalculatedContributions: Dictionary<ICalculatedContribution | undefined>;
  tokensDisbursal: TTokenDisbursalData;
  incomingPayouts: IIncomingPayouts;
  tokensPersonalDiscounts: Dictionary<TTokensPersonalDiscount | undefined>;
}

export const etoFlowInitialState: IInvestorTicketsState = {
  calculatedContributions: {},
  initialCalculatedContributions: {},
  investorEtoTickets: {},
  tokensDisbursal: {
    loading: false,
    error: false,
    data: undefined,
  },
  incomingPayouts: {
    loading: false,
    error: false,
    data: undefined,
  },
  tokensPersonalDiscounts: {},
};

export const investorTicketsReducer: AppReducer<IInvestorTicketsState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IInvestorTicketsState> => {
  switch (action.type) {
    case actions.investorEtoTicket.setEtoInvestorTicket.getType():
      return {
        ...state,
        investorEtoTickets: {
          ...state.investorEtoTickets,
          [action.payload.etoId]: action.payload.ticket,
        },
      };
    case actions.investorEtoTicket.setCalculatedContribution.getType():
      return {
        ...state,
        calculatedContributions: {
          ...state.calculatedContributions,
          [action.payload.etoId]: action.payload.contribution,
        },
      };
    case actions.investorEtoTicket.setInitialCalculatedContribution.getType():
      return {
        ...state,
        initialCalculatedContributions: {
          ...state.initialCalculatedContributions,
          [action.payload.etoId]: action.payload.contribution,
        },
      };
    case actions.investorEtoTicket.loadClaimables.getType():
      return {
        ...state,
        tokensDisbursal: {
          ...state.tokensDisbursal,
          loading: true,
          error: false,
        },
      };
    case actions.investorEtoTicket.setTokensDisbursalError.getType():
      return {
        ...state,
        tokensDisbursal: {
          ...state.tokensDisbursal,
          loading: false,
          error: true,
        },
      };
    case actions.investorEtoTicket.setTokensDisbursal.getType():
      return {
        ...state,
        tokensDisbursal: {
          loading: false,
          error: false,
          data: action.payload.tokensDisbursal,
        },
      };
    case actions.investorEtoTicket.getIncomingPayouts.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: true,
          error: false,
        },
      };
    case actions.investorEtoTicket.setIncomingPayouts.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: false,
          error: false,
          data: action.payload.incomingPayouts,
        },
      };
    case actions.investorEtoTicket.setIncomingPayoutsError.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: false,
          error: true,
        },
      };
    case actions.investorEtoTicket.resetIncomingPayouts.getType():
      return {
        ...state,
        incomingPayouts: {
          ...state.incomingPayouts,
          loading: true,
          error: false,
          data: undefined,
        },
      };

    case actions.investorEtoTicket.setTokenPersonalDiscount.getType():
      return {
        ...state,
        tokensPersonalDiscounts: {
          ...state.tokensPersonalDiscounts,
          [action.payload.etoId]: action.payload.tokenPersonalDiscount,
        },
      };
  }

  return state;
};
