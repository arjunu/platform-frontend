import { AppReducer } from "../../../../store";
import { actions } from "../../../actions";

export interface IKycIdNowState {
  redirectUrl: string | undefined;
}

export const idNowInitialState: IKycIdNowState = {
  redirectUrl: undefined,
};

export const idNowReducer: AppReducer<IKycIdNowState> = (state = idNowInitialState, action) => {
  switch (action.type) {
    case actions.kyc.setIdNowRedirectUrl.getType():
      return {
        ...idNowInitialState,
        redirectUrl: action.payload.redirectUrl,
      };

    default:
      return state;
  }
};
