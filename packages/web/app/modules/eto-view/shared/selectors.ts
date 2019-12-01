import { IAppState } from "../../../store";
import { EProcessState } from "../../../utils/enums/processStates";

export const selectEtoViewDataState = (state: IAppState): EProcessState =>
  state.etoView.processState;

export const selectEtoViewData = (state: IAppState) => state.etoView;
