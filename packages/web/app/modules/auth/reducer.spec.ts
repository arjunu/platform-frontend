import { expect } from "chai";

import { EUserType } from "../../lib/api/users/interfaces";
import { EthereumAddressWithChecksum } from "../../utils/opaque-types/types";
import { EWalletSubType, EWalletType } from "../web3/types";
import { EAuthStatus, IAuthState } from "./reducer";
import { selectIsAuthorized, selectUserEmail } from "./selectors";

describe("auth > selectors", () => {
  describe("selectIsAuthorized", () => {
    it("should return true for authorized users", () => {
      const state: IAuthState = {
        jwt: "eyjwt",
        user: {
          userId: "user-id" as EthereumAddressWithChecksum,
          type: EUserType.INVESTOR,
          walletType: EWalletType.LIGHT,
          walletSubtype: EWalletSubType.UNKNOWN,
        },
        status: EAuthStatus.AUTHORIZED,
        currentAgreementHash: undefined,
      };

      const actualValue = selectIsAuthorized(state);

      expect(actualValue).to.be.true;
    });

    it("should return false for not authorized users", () => {
      // this should only happen in the middle of auth process
      const state: IAuthState = {
        jwt: "eyjwt",
        user: undefined,
        status: EAuthStatus.NON_AUTHORIZED,
        currentAgreementHash: undefined,
      };

      const actualValue = selectIsAuthorized(state);

      expect(actualValue).to.be.false;
    });
  });

  describe("selectUserEmail", () => {
    it("should prefer unverified user email", () => {
      const state: IAuthState = {
        jwt: "eyjwt",
        user: {
          userId: "user-id" as EthereumAddressWithChecksum,
          unverifiedEmail: "unverified@email.com",
          verifiedEmail: "some.verified@email.com",
          type: EUserType.INVESTOR,
          walletType: EWalletType.LIGHT,
          walletSubtype: EWalletSubType.UNKNOWN,
        },
        status: EAuthStatus.AUTHORIZED,
        currentAgreementHash: undefined,
      };

      const actualValue = selectUserEmail(state);

      expect(actualValue).to.be.eq(state.user!.unverifiedEmail);
    });

    it("should return undefined when user is missing", () => {
      const state: IAuthState = {
        jwt: "eyjwt",
        user: undefined,
        status: EAuthStatus.NON_AUTHORIZED,
        currentAgreementHash: undefined,
      };

      const actualValue = selectUserEmail(state);

      expect(actualValue).to.be.undefined;
    });
  });
});
