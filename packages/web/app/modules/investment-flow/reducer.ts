import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

export enum EInvestmentType {
  Eth = "ETH",
  NEur = "NEUR",
  ICBMEth = "ICBM_ETH",
  ICBMnEuro = "ICBM_NEUR",
}

export enum EInvestmentErrorState {
  AboveMaximumTicketSize = "above_maximum_ticket_size",
  BelowMinimumTicketSize = "below_minimum_ticket_size",
  ExceedsTokenAmount = "exceeds_token_amount",
  ExceedsWalletBalance = "exceeds_wallet_balance",
}

export interface IInvestmentFlowState {
  etoId: string;
  euroValueUlps: string;
  ethValueUlps: string;
  investmentType?: EInvestmentType;
  activeInvestmentTypes: EInvestmentType[];
  errorState?: EInvestmentErrorState;
  isValidatedInput: boolean;
}

export const investmentFlowInitialState: IInvestmentFlowState = {
  etoId: "",
  euroValueUlps: "",
  ethValueUlps: "",
  investmentType: EInvestmentType.Eth,
  activeInvestmentTypes: [],
  isValidatedInput: false,
};

export const investmentFlowReducer: AppReducer<IInvestmentFlowState> = (
  state = investmentFlowInitialState,
  action,
): DeepReadonly<IInvestmentFlowState> => {
  switch (action.type) {
    case actions.investmentFlow.resetInvestment.getType():
      return investmentFlowInitialState;
    case actions.investmentFlow.selectInvestmentType.getType():
      return {
        ...investmentFlowInitialState,
        etoId: state.etoId,
        activeInvestmentTypes: state.activeInvestmentTypes,
        investmentType: action.payload.type,
      };
    case actions.investmentFlow.setEtoId.getType():
      return {
        ...state,
        etoId: action.payload.etoId,
      };
    case actions.investmentFlow.setErrorState.getType():
      return {
        ...state,
        errorState: action.payload.errorState,
      };
    case actions.investmentFlow.setEthValue.getType():
      return {
        ...state,
        ethValueUlps: action.payload.value,
      };
    case actions.investmentFlow.setEurValue.getType():
      return {
        ...state,
        euroValueUlps: action.payload.value,
      };
    case actions.investmentFlow.setIsInputValidated.getType():
      return {
        ...state,
        isValidatedInput: action.payload.isValidated,
      };
    case actions.investmentFlow.setActiveInvestmentTypes.getType():
      return {
        ...state,
        ...action.payload,
      };
  }

  return state;
};
