import { expect } from "chai";

import { appRoutes } from "../../components/appRoutes";
import { EUserType } from "../../lib/api/users/interfaces";
import { IAppState } from "../../store";
import { DeepPartial } from "../../types";
import { selectIsVisibleSecurityNotification } from "./selectors";

describe("selectIsVisibleSecurityNotification", () => {
  it("should return false if KYC data is still loading", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {
        statusLoading: true,
      },
      auth: {
        user: {
          type: EUserType.INVESTOR,
        },
      },
      router: {},
    };

    const actual = selectIsVisibleSecurityNotification(appState as any);

    expect(actual).to.be.false;
  });

  it("should return false if route is whitelisted", () => {
    const appState: DeepPartial<IAppState> = {
      kyc: {},
      auth: {
        user: {
          type: EUserType.INVESTOR,
        },
      },
      router: {
        location: {
          pathname: appRoutes.kyc,
        },
      },
    };

    const actual = selectIsVisibleSecurityNotification(appState as any);

    expect(actual).to.be.false;
  });
});
