import { IUser } from "../../lib/api/users/interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

export enum EAuthStatus {
  AUTHORIZED = "authorized",
  NON_AUTHORIZED = "non-authorized",
}

export interface IAuthState {
  user: IUser | undefined;
  jwt: string | undefined;
  status: EAuthStatus;
  currentAgreementHash: string | undefined;
}

const authInitialState: IAuthState = {
  user: undefined,
  jwt: undefined,
  status: EAuthStatus.NON_AUTHORIZED,
  currentAgreementHash: undefined,
};

export const authReducer: AppReducer<IAuthState> = (
  state = authInitialState,
  action,
): DeepReadonly<IAuthState> => {
  switch (action.type) {
    case actions.auth.setUser.getType():
      return {
        ...state,
        user: action.payload.user,
      };
    case actions.auth.setJWT.getType():
      return {
        ...state,
        jwt: action.payload.jwt,
      };
    case actions.auth.finishSigning.getType():
      return {
        ...state,
        status: EAuthStatus.AUTHORIZED,
      };
    case actions.tosModal.setCurrentTosHash.getType():
      return {
        ...state,
        currentAgreementHash: action.payload.currentAgreementHash,
      };
    case actions.auth.reset.getType():
      return authInitialState;
    //Log out is done on whole state instead of just AUTH reducer
  }

  return state;
};
