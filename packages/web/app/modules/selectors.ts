import { EKycRequestStatus } from "../lib/api/kyc/KycApi.interfaces";
import { IAppState } from "../store";
import { selectBackupCodesVerified, selectIsUserEmailVerified } from "./auth/selectors";
import { selectKycRequestStatus } from "./kyc/selectors";

/*
 * @deprecated, please use selectIsUserFullyVerified
 * (packages/web/app/modules/auth/selectors.ts)
 * */
export const selectIsVerificationFullyDone = (state: IAppState) =>
  !!(
    selectIsUserEmailVerified(state.auth) &&
    selectBackupCodesVerified(state) &&
    selectKycRequestStatus(state) === EKycRequestStatus.ACCEPTED
  );
