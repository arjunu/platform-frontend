import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";
import { actions } from "../actions";

export type TFullPageLoadingState = {
  isOpen: boolean;
};

const initialState: TFullPageLoadingState = {
  isOpen: false,
};

export const fullPageLoadingReducer: AppReducer<TFullPageLoadingState> = (
  state = initialState,
  action,
): DeepReadonly<TFullPageLoadingState> => {
  switch (action.type) {
    case actions.fullPageLoading.showFullPageLoading.getType():
      return {
        ...state,
        isOpen: true,
      };
    case actions.fullPageLoading.hideFullPageLoading.getType():
      return {
        ...state,
        isOpen: false,
      };
  }

  return state;
};
