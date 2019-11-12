import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";
import { IEtoFlowState } from "./types";

export const etoFlowInitialState: IEtoFlowState = {
  eto: undefined,
  company: undefined,
  products: undefined,
  loading: false,
  saving: false,
  bookbuildingStats: [],
  etoDateSaving: false,
};

export const etoFlowReducer: AppReducer<IEtoFlowState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoFlowState> => {
  switch (action.type) {
    case actions.etoFlow.loadIssuerEto.getType():
      return {
        ...state,
        loading: true,
      };
    case actions.etoFlow.setEto.getType():
      return {
        ...state,
        eto: action.payload.eto,
        company: action.payload.company || state.company,
        loading: false,
        saving: false,
      };
    case actions.etoFlow.loadDataStop.getType():
      return {
        ...state,
        loading: false,
        saving: false,
      };
    case actions.etoFlow.saveCompanyStart.getType():
    case actions.etoFlow.saveEtoStart.getType():
    case actions.etoFlow.submitDataStart.getType():
      return {
        ...state,
        saving: true,
      };
    case "ETO_FLOW_SET_START_DATE":
    case "ETO_FLOW_CLEAR_START_DATE":
      return {
        ...state,
        ...action.payload,
      };
    case actions.etoFlow.setProducts.getType():
      return {
        ...state,
        products: action.payload.products,
      };
    case actions.etoFlow.setEtoDateStart.getType():
      return {
        ...state,
        etoDateSaving: true,
      };
    case actions.etoFlow.setEtoDateStop.getType():
      return {
        ...state,
        etoDateSaving: false,
      };
  }
  return state;
};
