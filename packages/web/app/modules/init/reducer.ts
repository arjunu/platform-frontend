import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

export enum EInitType {
  APP_INIT = "appInit",
  SMART_CONTRACTS_INIT = "smartcontractsInit",
  WALLET_INIT = "walletInit",
}

interface IAsyncActionState {
  inProgress: boolean;
  done: boolean;
  error?: string;
}

export interface IInitState {
  appInit: IAsyncActionState;
  smartcontractsInit: IAsyncActionState;
}

export const initInitialState: IInitState = {
  appInit: {
    done: false,
    inProgress: false,
  },
  smartcontractsInit: {
    done: false,
    inProgress: false,
  },
};

export const initReducer: AppReducer<IInitState> = (
  state = initInitialState,
  action,
): DeepReadonly<IInitState> => {
  switch (action.type) {
    case actions.init.start.getType():
      return {
        ...state,
        [action.payload.initType]: {
          inProgress: true,
          done: false,
        },
      };
    case actions.init.done.getType():
      return {
        ...state,
        [action.payload.initType]: {
          inProgress: false,
          done: true,
        },
      };
    case actions.init.error.getType():
      return {
        ...state,
        [action.payload.initType]: {
          inProgress: false,
          done: false,
          error: action.payload.errorMsg,
        },
      };
  }

  return state;
};
