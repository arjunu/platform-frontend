import { TMessage } from "../../../components/translatedMessages/utils";
import { AppReducer } from "../../../store";
import { DeepReadonly } from "../../../types";

export interface IBrowserWalletWizardState {
  errorMsg: DeepReadonly<TMessage> | undefined;
  isLoading: boolean;
  approvalRejected: boolean;
}

export const browserWalletWizardInitialState: IBrowserWalletWizardState = {
  errorMsg: undefined,
  isLoading: false,
  approvalRejected: false,
};

export const browserWalletWizardReducer: AppReducer<IBrowserWalletWizardState> = (
  state = browserWalletWizardInitialState,
  action,
): IBrowserWalletWizardState => {
  switch (action.type) {
    case "BROWSER_WALLET_TRY_CONNECTING":
      return {
        ...browserWalletWizardInitialState,
        isLoading: true,
      };
    case "BROWSER_WALLET_CONNECTION_ERROR":
      return {
        ...state,
        errorMsg: action.payload.errorMsg,
        isLoading: false,
      };
    case "BROWSER_WALLET_APPROVAL_REJECTED":
      return {
        ...state,
        isLoading: false,
        approvalRejected: true,
      };

    default:
      return state;
  }
};
