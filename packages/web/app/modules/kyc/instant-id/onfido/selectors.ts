import { IAppState } from "../../../../store";

export const selectKycOnfido = (state: IAppState) => state.kyc.onfido;
