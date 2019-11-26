import { AppReducer } from "../../store";
import { DeepReadonly, XOR } from "../../types";
import { actions } from "../actions";
import { EProcessState } from "../../utils/enums/processStates";
import { TEtoWithCompanyAndContractReadonly } from "../eto/types";

export type TInvestorEtoViewData = {
  eto: TEtoWithCompanyAndContractReadonly,
  userIsFullyVerified: boolean
}

export type TReadyEtoView = {
  processState: EProcessState.SUCCESS,
} & TInvestorEtoViewData

export type TNotReadyEtoView = { processState: EProcessState.ERROR } |
  { processState: EProcessState.NOT_STARTED } |
  { processState: EProcessState.IN_PROGRESS}

export type TEtoViewState = XOR<TReadyEtoView , TNotReadyEtoView>

const etoViewInitialState:TNotReadyEtoView = {
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
        ...action.payload.etoData
      };
    case actions.etoView.setEtoError.getType():
      return {
        processState: EProcessState.ERROR,
      }
  }
  return state;
};
