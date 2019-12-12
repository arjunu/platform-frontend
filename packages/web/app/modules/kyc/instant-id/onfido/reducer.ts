import { AppReducer } from "../../../../store";
import { DeepReadonly } from "../../../../types";
import { actions } from "../../../actions";

export interface IKycOnfidoState {
  requestStartError: Error | undefined;
}

export const onfidoInitialState: IKycOnfidoState = {
  requestStartError: undefined,
};

export const onfidoReducer: AppReducer<IKycOnfidoState> = (
  state = onfidoInitialState,
  action,
): DeepReadonly<IKycOnfidoState> => {
  switch (action.type) {
    case actions.kyc.startOnfidoRequest.getType():
      return onfidoInitialState;
    case actions.kyc.startOnfidoRequestError.getType():
      return {
        requestStartError: action.payload.error,
      };
    default:
      return state;
  }
};
