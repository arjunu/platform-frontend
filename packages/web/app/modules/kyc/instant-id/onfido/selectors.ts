import { createSelector } from "reselect";

import { IAppState } from "../../../../store";

export const selectKycOnfido = (state: IAppState) => state.kyc.onfido;

export const selectKycOnfidoRequestStartError = createSelector(
  selectKycOnfido,
  onfido => onfido.requestStartError,
);
