import { createSelector } from "reselect";

import { IAppState } from "../../../../store";

export const selectKycIdNow = (state: IAppState) => state.kyc.idNow;

export const selectKycIdNowRedirectUrl = createSelector(selectKycIdNow, idNow => idNow.redirectUrl);
