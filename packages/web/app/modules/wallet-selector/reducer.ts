import { TMessage } from "../../components/translatedMessages/utils";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

export interface IWalletSelectorState {
  isMessageSigning: boolean;
  messageSigningError: DeepReadonly<TMessage> | undefined;
}

const walletSelectorInitialState: IWalletSelectorState = {
  isMessageSigning: false,
  messageSigningError: undefined,
};

export const walletSelectorReducer: AppReducer<IWalletSelectorState> = (
  state = walletSelectorInitialState,
  action,
): IWalletSelectorState => {
  switch (action.type) {
    case actions.walletSelector.messageSigning.getType():
      return {
        ...state,
        isMessageSigning: true,
        messageSigningError: undefined,
      };
    case actions.walletSelector.messageSigningError.getType():
      return {
        ...state,
        messageSigningError: action.payload.errorMessage,
      };
    case actions.walletSelector.reset.getType():
      return {
        ...state,
        isMessageSigning: false,
        messageSigningError: undefined,
      };
  }

  return state;
};
