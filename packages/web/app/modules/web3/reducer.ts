import { AppReducer } from "../../store";
import { actions } from "../actions";
import { TWalletMetadata } from "./types";

export interface IDisconnectedWeb3State {
  connected: false;
  previousConnectedWallet?: TWalletMetadata;
}

export interface IWalletPrivateData {
  seed: string[];
  privateKey: string;
}
export interface IConnectedWeb3State {
  connected: true;
  wallet: TWalletMetadata;
  isUnlocked: boolean; // this is important only for light wallet
  walletPrivateData?: {
    seed: string;
    privateKey: string;
  };
}

export type IWeb3State = IDisconnectedWeb3State | IConnectedWeb3State;

export const web3InitialState: IWeb3State = {
  connected: false,
};

export const web3Reducer: AppReducer<IWeb3State> = (
  state = web3InitialState,
  action,
): IWeb3State => {
  switch (action.type) {
    case "NEW_PERSONAL_WALLET_PLUGGED":
      return {
        connected: true,
        wallet: action.payload.walletMetadata,
        isUnlocked: action.payload.isUnlocked,
      };
    case actions.web3.personalWalletDisconnected.getType():
      return {
        connected: false,
        previousConnectedWallet: state.connected ? state.wallet : state.previousConnectedWallet,
      };
    case "WEB3_WALLET_UNLOCKED":
      if (state.connected) {
        return {
          ...state,
          isUnlocked: true,
        };
      } else {
        return state;
      }
    case "WEB3_WALLET_LOCKED":
      if (state.connected) {
        return {
          ...state,
          isUnlocked: false,
        };
      } else {
        return state;
      }
    case "LOAD_PREVIOUS_WALLET":
      if (!state.connected) {
        return {
          ...state,
          previousConnectedWallet: action.payload,
        };
      } else {
        return state;
      }
    case "WEB3_LOAD_SEED":
      if (state.connected) {
        return {
          ...state,
          walletPrivateData: {
            seed: action.payload.seed,
            privateKey: action.payload.privateKey,
          },
        };
      } else {
        return state;
      }
    case "WEB3_CLEAR_SEED":
      if (state.connected) {
        return {
          ...state,
          walletPrivateData: undefined,
        };
      } else {
        return state;
      }
  }
  return state;
};
