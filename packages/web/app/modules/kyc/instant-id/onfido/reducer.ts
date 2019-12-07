import { AppReducer } from "../../../../store";
import { DeepReadonly } from "../../../../types";

export interface IKycOnfidoState {}

export const onfidoInitialState: IKycOnfidoState = {};

export const onfidoReducer: AppReducer<IKycOnfidoState> = (
  state = onfidoInitialState,
): DeepReadonly<IKycOnfidoState> => state;
