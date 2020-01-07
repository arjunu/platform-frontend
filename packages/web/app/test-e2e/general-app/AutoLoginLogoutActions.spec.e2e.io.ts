import BroadcastChannel from "broadcast-channel";

import { symbols } from "../../di/symbols";
import {
  assertDashboard,
  assertLanding,
  assertLogin,
  goToDashboard,
  goToLanding,
  tid,
} from "../utils";
import { cyPromise } from "../utils/cyPromise";
import {
  createAndLoginNewUser,
  getJwtToken,
  getWalletMetaData,
  JWT_KEY,
  NF_USER_KEY,
  WALLET_STORAGE_KEY,
} from "../utils/userHelpers";

const REGISTRATION_LOGIN_DONE = "logged_in";
const AUTH_INACTIVITY_THRESHOLD = 300000;

const clearKeyFromStorageWithEvents = (Window: Window, key: string) => {
  Window.dispatchEvent(
    new StorageEvent("storage", {
      key,
      oldValue: Window.localStorage.getItem(key),
      newValue: undefined,
    }),
  );
  Window.localStorage.removeItem(key);
};
const setKeyFromStorageWithEvents = (Window: Window, key: string, newValue: string) => {
  const oldValue = Window.localStorage.getItem(key);
  Window.localStorage.setItem(key, newValue);
  Window.dispatchEvent(
    new StorageEvent("storage", {
      key,
      newValue,
      oldValue,
    }),
  );
};

export enum EUserActivityMessage {
  USER_ACTIVE = "user-active",
}

export declare type UserActivityChannelMessage = {
  status: EUserActivityMessage;
};

const channel: BroadcastChannel<UserActivityChannelMessage> = new BroadcastChannel(
  symbols.userActivityChannel.toString(),
  { webWorkerSupport: false },
);

const pushTimeThenPostMessage = (clock: any) =>
  cyPromise(() => {
    // Posting a message takes some time before it reaches to another browser this generates race conditions
    // We need to await for sometimes to guarantee that the posted message was received
    cy.wait(500);
    clock.tick(AUTH_INACTIVITY_THRESHOLD / 2);
    return channel.postMessage({
      status: EUserActivityMessage.USER_ACTIVE,
    });
  });

describe("auto-logout/auto-login", () => {
  describe("Automatic Actions", () => {
    it("should logout automatically when a user has no activity", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        goToDashboard();
        const now = Date.now();
        cy.clock(now).then(clock => {
          clock.tick(AUTH_INACTIVITY_THRESHOLD / 2);
          assertDashboard();
          clock.tick(AUTH_INACTIVITY_THRESHOLD);
          assertLogin();
        });
      });
    });

    it("should not logout automatically when a user has activity", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        goToDashboard();
        const now = Date.now();
        cy.clock(now).then(clock => {
          cyPromise(() => {
            clock.tick(AUTH_INACTIVITY_THRESHOLD / 2);
            cy.get(tid("authorized-layout-wallet-button")).trigger("mousedown");
            return cy.get(tid("authorized-layout-wallet-button")).trigger("mouseleave");
          }).then(() => {
            clock.tick(AUTH_INACTIVITY_THRESHOLD / 2);
            assertDashboard();
          });
        });
      });
    });

    it("should not logout automatically when a user has activity in another tab", () => {
      createAndLoginNewUser({
        type: "investor",
        kyc: "business",
      }).then(() => {
        goToDashboard();
        const now = Date.now();
        cy.clock(now).then(clock => {
          pushTimeThenPostMessage(clock);
          pushTimeThenPostMessage(clock);
          pushTimeThenPostMessage(clock);
          assertDashboard();
        });
      });
    });
  });
});
describe("User Driven Actions", () => {
  it("should logout automatically when a user logs out from another tab", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();

      cy.window().then(Window => {
        clearKeyFromStorageWithEvents(Window, JWT_KEY);
        assertLanding();
      });
    });
  });
  it("should login automatically when a user logs-in from another tab", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      const jwt = getJwtToken();
      const walletData = getWalletMetaData();
      cy.clearLocalStorage();
      goToLanding();
      cy.window().then(Window => {
        setKeyFromStorageWithEvents(Window, WALLET_STORAGE_KEY, JSON.stringify(walletData));
        setKeyFromStorageWithEvents(Window, JWT_KEY, JSON.stringify(jwt));
        setKeyFromStorageWithEvents(Window, NF_USER_KEY, JSON.stringify(REGISTRATION_LOGIN_DONE));
        assertDashboard();
      });
    });
  });
  it("should logout automatically when wallet Metadata is not present", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();
      cy.window().then(Window => {
        clearKeyFromStorageWithEvents(Window, WALLET_STORAGE_KEY);
        assertLanding();
      });
    });
  });
  it("should not start app when metadata is not present", () => {
    createAndLoginNewUser({
      type: "investor",
      kyc: "business",
    }).then(() => {
      goToDashboard();
      cy.window().then(Window => {
        Window.localStorage.removeItem(WALLET_STORAGE_KEY);
        goToDashboard(false);
        assertLanding();
      });
    });
  });
});
