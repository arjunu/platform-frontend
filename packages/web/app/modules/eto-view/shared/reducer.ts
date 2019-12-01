import { AppReducer } from "../../../store";
import { DeepReadonly } from "../../../types";
import { EProcessState } from "../../../utils/enums/processStates";
import { actions } from "../../actions";
import { TEtoViewState, TNotReadyEtoView } from "./types";

const etoViewInitialState: TNotReadyEtoView = {
  processState: EProcessState.NOT_STARTED,
};

export const etoViewReducer: AppReducer<TEtoViewState> = (
  state = etoViewInitialState,
  action,
): DeepReadonly<TEtoViewState> => {
  switch (action.type) {
    case actions.etoView.setEtoViewData.getType():
      return {
        processState: EProcessState.SUCCESS,
        ...action.payload.etoData,
      };
    case actions.etoView.setEtoError.getType():
      return {
        processState: EProcessState.ERROR,
      };
  }
  return state;
};
