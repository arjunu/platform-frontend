import { TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { ICalculatedContribution, IEtoContractData } from "./types";

export interface IPublicEtoState {
  publicEtos: { [etoId: string]: TPublicEtoData | undefined };
  calculatedContributions: { [etoId: string]: ICalculatedContribution };
  contracts: { [etoId: string]: IEtoContractData };
  displayOrder: string[];
}

export const etoFlowInitialState: IPublicEtoState = {
  publicEtos: {},
  calculatedContributions: {},
  contracts: {},
  displayOrder: [],
};

export const publicEtosReducer: AppReducer<IPublicEtoState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IPublicEtoState> => {
  switch (action.type) {
    case "PUBLIC_ETOS_SET_PUBLIC_ETOS":
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          ...action.payload.etos,
        },
      };
    case "PUBLIC_ETOS_SET_PUBLIC_ETO":
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          [action.payload.eto.previewCode]: action.payload.eto,
        },
      };
    case "PUBLIC_ETOS_SET_DISPLAY_ORDER":
      return {
        ...state,
        displayOrder: action.payload.order,
      };
    case "PUBLIC_ETOS_SET_CALCULATED_CONTRIBUTION":
      return {
        ...state,
        calculatedContributions: {
          ...state.calculatedContributions,
          [action.payload.previewCode]: action.payload.contrib,
        },
      };
    case "PUBLIC_ETOS_SET_ETO_DATA_FROM_CONTRACT":
      return {
        ...state,
        contracts: {
          ...state.contracts,
          [action.payload.previewCode]: action.payload.data,
        },
      };
  }

  return state;
};
