import { expect } from "chai";
import { EventEmitter } from "events";
import { delay } from "redux-saga";
import { expectSaga } from "redux-saga-test-plan";
import { call } from "redux-saga/effects";

import { createMock } from "../../../test/testUtils";
import { LIGHT_WALLET_PASSWORD_CACHE_TIME } from "../../config/constants";
import { noopLogger } from "../../lib/dependencies/logger";
import { EWeb3ManagerEvents, Web3Manager } from "../../lib/web3/Web3Manager/Web3Manager";
import { actions } from "../actions";
import { autoLockLightWallet, initWeb3ManagerEvents } from "./sagas";

describe("Web3 sagas", () => {
  describe("light wallet password", () => {
    it("should reset password after timeout", async () => {
      const personalWalletMock = {
        password: "some dummy pass",
      } as any;
      const web3ManagerMock = createMock(Web3Manager, {
        personalWallet: personalWalletMock,
      });

      await expectSaga(autoLockLightWallet as any, {
        web3Manager: web3ManagerMock,
        logger: noopLogger,
      })
        .put(actions.web3.walletLocked())
        .call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME)
        .provide([[call(delay, LIGHT_WALLET_PASSWORD_CACHE_TIME), undefined]])
        .run();

      expect(personalWalletMock.password).to.be.undefined;
    });
  });

  describe("web3Manager events connection", () => {
    it("connects to event from web3Manager", () => {
      const web3ManagerMock = new EventEmitter();
      const eventPayload = {
        metaData: "foo",
        isUnlocked: true,
      };
      const promise = expectSaga(initWeb3ManagerEvents, {
        web3Manager: web3ManagerMock,
      })
        .put(
          actions.web3.newPersonalWalletPlugged(
            eventPayload.metaData as any,
            eventPayload.isUnlocked,
          ),
        )
        .run();

      web3ManagerMock.emit(EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, eventPayload);
      return promise;
    });
  });
});
