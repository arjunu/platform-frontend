import { expect } from "chai";

import { EKycRequestStatus } from "../../lib/api/kyc/KycApi.interfaces";
import { EUserType } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { DeepPartial } from "../../types";
import { selectKycRequestStatus } from "./selectors";

describe("selectKycRequestStatus", () => {
  const authState = {
    auth: {
      user: {
        type: EUserType.INVESTOR,
      },
    },
  };

  it("should return pending if kyc is approved and on chain claim is false", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        individualRequestStateLoading: true,
        individualRequestState: { status: EKycRequestStatus.ACCEPTED },
        businessRequestStateLoading: false,
        claims: { isVerified: false },
      },
      router: {},
    };

    const actual = selectKycRequestStatus({ ...appState, auth: authState } as any);

    expect(actual).to.be.equal(EKycRequestStatus.PENDING);
  });
  it("should return approved if kyc is approved and on chain claim is true", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        individualRequestStateLoading: true,
        individualRequestState: { status: EKycRequestStatus.DRAFT },
        businessRequestStateLoading: false,
        claims: { isVerified: true },
      },
      router: {},
    };

    const actual = selectKycRequestStatus({ ...appState, auth: authState } as any);

    expect(actual).to.be.equal(EKycRequestStatus.DRAFT);
  });
  it("should return approved if kyc is approved and on chain claim is true", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        individualRequestStateLoading: true,
        individualRequestState: { status: EKycRequestStatus.ACCEPTED },
        businessRequestStateLoading: false,
        claims: { isVerified: false },
      },
      router: {},
    };

    const actual = selectKycRequestStatus({ ...appState, auth: authState } as any);

    expect(actual).to.be.equal(EKycRequestStatus.PENDING);
  });
});
