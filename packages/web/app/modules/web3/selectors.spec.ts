import { nonNullable } from "@neufund/shared"
import { expect } from "chai";

import { dummyEthereumAddress } from "../../../test/fixtures";
import { IAppState } from "../../store";
import {
  getDummyBrowserWalletMetadata,
  getDummyLedgerWalletMetadata,
  getDummyLightWalletMetadata,
} from "./fixtures";
import { IWeb3State } from "./reducer";
import {
  selectActivationCodeFromQueryString,
  selectIsExternalWallet,
  selectIsLightWallet,
  selectLightWalletEmailFromQueryString,
  selectLightWalletFromQueryString,
} from "./selectors";
import { EWalletSubType, EWalletType } from "./types";

describe("web3 > selectors", () => {
  const salt = "salt";
  const code = "code";
  const email = "test@example.com";

  describe("selectIsLightWallet", () => {
    it("should work with connected wallet", () => {
      const state: IWeb3State = {
        connected: true,
        isUnlocked: false,
        wallet: getDummyLightWalletMetadata(),
      };

      const isLightWallet = selectIsLightWallet(state);

      expect(isLightWallet).to.be.true;
    });

    it("should work with not connected wallet", () => {
      const state: IWeb3State = {
        connected: false,
        previousConnectedWallet: {
          walletType: EWalletType.LIGHT,
          walletSubType: EWalletSubType.UNKNOWN,
          address: dummyEthereumAddress,
          email,
          salt,
        },
      };

      const isLightWallet = selectIsLightWallet(state);

      expect(isLightWallet).to.be.true;
    });
  });

  describe("selectIsExternalWallet", () => {
    it("should return true for Ledger wallet", () => {
      const state: IWeb3State = {
        connected: true,
        isUnlocked: false,
        wallet: getDummyLedgerWalletMetadata(),
      };

      const isExternalWallet = selectIsExternalWallet(state);

      expect(isExternalWallet).to.be.true;
    });

    it("should return true for Browser wallet", () => {
      const state: IWeb3State = {
        connected: true,
        isUnlocked: false,
        wallet: getDummyBrowserWalletMetadata(),
      };

      const isExternalWallet = selectIsExternalWallet(state);

      expect(isExternalWallet).to.be.true;
    });

    it("should return false for Light wallet", () => {
      const state: IWeb3State = {
        connected: true,
        isUnlocked: false,
        wallet: getDummyLightWalletMetadata(),
      };

      const isExternalWallet = selectIsExternalWallet(state);

      expect(isExternalWallet).to.be.false;
    });
  });

  describe("selectActivationCodeFromQueryString", () => {
    it("should work with activation link", () => {
      const state = {
        router: {
          location: {
            pathname: "/login/light",
            state: undefined,
            hash: "",
            search: encodeURI(`?redirect=/&code=${code}`),
          },
          action: "POP",
        },
      } as IAppState;

      const result = nonNullable(selectActivationCodeFromQueryString(state));

      expect(result.verificationCode === code).to.be.true;
    });
  });

  describe("selectLightWalletFromQueryString", () => {
    it("should work with activation link", () => {
      const state = {
        router: {
          location: {
            pathname: "/login/light",
            state: undefined,
            hash: "",
            search: encodeURI(`?redirect=/&email=${email}&salt=${salt}`),
          },
        },
      } as IAppState;

      const result = nonNullable(selectLightWalletFromQueryString(state));

      expect(result.email).to.be.eq(email);

      expect(result.salt).to.be.eq(salt);
    });

    it("should not work if email or salt is not provided", () => {
      const state = {
        router: {
          location: {
            pathname: "/login/light",
            state: undefined,
            hash: "",
            search: encodeURI(`?redirect=/&email=${email}`),
          },
        },
      } as IAppState;

      expect(selectLightWalletFromQueryString(state)).to.be.undefined;

      state.router.location.search = encodeURI(`?redirect=/&salt=${salt}`);

      expect(selectLightWalletFromQueryString(state)).to.be.undefined;
    });
  });

  describe("selectLightWalletEmailFromQueryString", () => {
    it("should not detect light wallet when salt is missing", () => {
      const state = {
        router: {
          location: {
            pathname: "/login/light",
            state: undefined,
            hash: "",
            search: encodeURI(`?redirect=/&email=${email}`),
          },
        },
      } as IAppState;

      expect(selectLightWalletEmailFromQueryString(state)).to.be.undefined;
    });
  });
});
