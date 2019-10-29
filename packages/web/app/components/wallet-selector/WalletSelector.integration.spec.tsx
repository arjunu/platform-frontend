import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import * as jsonwebtoken from "jsonwebtoken";
import * as React from "react";
import { Route } from "react-router";

import { createMount, remount } from "../../../test/createMount";
import { dummyEthereumAddress, dummyNetworkId } from "../../../test/fixtures";
import {
  createIntegrationTestsSetup,
  setupFakeClock,
  waitForPredicate,
  waitForTid,
  wrapWithProviders,
} from "../../../test/integrationTestUtils.unsafe";
import { createMock, tid } from "../../../test/testUtils";
import { symbols } from "../../di/symbols";
import { SignatureAuthApi } from "../../lib/api/auth/SignatureAuthApi";
import { getDummyUser } from "../../lib/api/users/fixtures";
import { UsersApi } from "../../lib/api/users/UsersApi";
import { IdentityRegistry } from "../../lib/contracts/IdentityRegistry";
import { Neumark } from "../../lib/contracts/Neumark";
import { Storage } from "../../lib/persistence/Storage";
import {
  BrowserWallet,
  BrowserWalletConnector,
  BrowserWalletLockedError,
  BrowserWalletMissingError,
} from "../../lib/web3/browser-wallet/BrowserWallet";
import { ContractsService } from "../../lib/web3/ContractsService";
import { LedgerWalletConnector } from "../../lib/web3/ledger-wallet/LedgerConnector";
import { LedgerWallet } from "../../lib/web3/ledger-wallet/LedgerWallet";
import { SignerType } from "../../lib/web3/PersonalWeb3";
import { Web3Adapter } from "../../lib/web3/Web3Adapter";
import { Web3ManagerMock } from "../../lib/web3/Web3Manager/Web3Manager.mock";
import { actions } from "../../modules/actions";
import { neuCall } from "../../modules/sagasUtils";
import { initWeb3ManagerEvents } from "../../modules/web3/sagas";
import {
  EWalletSubType,
  EWalletType,
  IBrowserWalletMetadata,
  ILedgerWalletMetadata,
} from "../../modules/web3/types";
import { appRoutes } from "../appRoutes";
import { ButtonLink } from "../shared/buttons";
import { getMessageTranslation, LedgerErrorMessage } from "../translatedMessages/messages";
import { createMessage } from "../translatedMessages/utils";
import { walletRegisterRoutes } from "./walletRoutes";
import { WalletSelector } from "./WalletSelector";

describe("Wallet selector integration", () => {
  setupFakeClock();

  it("should select ledger wallet", async () => {
    const expectedDerivationPath = "44'/60'/0'/1";
    const expectedAddress = dummyEthereumAddress;
    const expectedChallenge = "CHALLENGE";

    const ledgerWalletMock = createMock(LedgerWallet, {
      walletType: EWalletType.LEDGER,
      walletSubType: EWalletSubType.UNKNOWN,
      ethereumAddress: expectedAddress,
      getSignerType: () => SignerType.ETH_SIGN,
      testConnection: async () => false,
      getMetadata: (): ILedgerWalletMetadata => ({
        walletType: EWalletType.LEDGER,
        walletSubType: EWalletSubType.UNKNOWN,
        derivationPath: expectedDerivationPath,
        address: expectedAddress,
      }),
      isUnlocked: () => true,
    });
    const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {});
    const internalWeb3AdapterMock = createMock(Web3Adapter, {
      getBalance: async () => new BigNumber("1"),
    });
    const signatureAuthApiMock = createMock(SignatureAuthApi, {
      challenge: async () => ({
        statusCode: 200,
        body: {
          challenge: expectedChallenge,
        },
      }),
      createJwt: async () => ({
        jwt: jsonwebtoken.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: "foobar",
          },
          "secret",
        ),
      }),
    });
    const usersApiMock = createMock(UsersApi, {
      me: async () => getDummyUser(ledgerWalletMock.getMetadata()),
      createAccount: async () => getDummyUser(ledgerWalletMock.getMetadata()),
    });

    const contractsMock = createMock(ContractsService, {
      neumark: createMock(Neumark, {
        balanceOf: (_address: string) => Promise.resolve(new BigNumber("1")),
      }),
      identityRegistry: createMock(IdentityRegistry, {
        getClaims: (_userId: string) => Promise.resolve("01001110"),
      }),
    });

    const { store, container, dispatchSpy, history, sagaMiddleware } = createIntegrationTestsSetup({
      ledgerWalletConnectorMock,
      signatureAuthApiMock,
      usersApiMock,
      storageMock: new Storage({} as any),
      contractsMock,
      initialState: {
        browser: {
          name: "chrome",
          version: "58.0.0",
        },
        init: {
          appInit: {
            done: true,
            inProgress: false,
          },
          smartcontractsInit: {
            done: true,
            inProgress: false,
          },
        },
      },
      initialRoute: walletRegisterRoutes.light,
    });
    // need to manually initialize, since contract setup is omitted
    sagaMiddleware.run(function*(): any {
      yield neuCall(initWeb3ManagerEvents);
    });

    container
      .get<Web3ManagerMock>(symbols.web3Manager)
      .initializeMock(internalWeb3AdapterMock, dummyNetworkId);
    const error = createMessage(LedgerErrorMessage.GENERIC_ERROR);
    const mountedComponent = createMount(
      wrapWithProviders(() => <Route component={WalletSelector} />, {
        container,
        store,
        history,
      }),
    );

    // ensure that ledger tab is selected
    mountedComponent
      .find(tid("wallet-selector-ledger"))
      .find(ButtonLink)
      .simulate("click", { button: 0 });

    await waitForTid(mountedComponent, "ledger-wallet-error-msg");

    expect(
      mountedComponent
        .find(tid("ledger-wallet-error-msg"))
        .children()
        .get(0),
    ).to.be.deep.eq(getMessageTranslation(error));

    // simulate successful connection
    ledgerWalletConnectorMock.reMock({
      connect: async () => {},
      testConnection: async () => true,
      getMultipleAccounts: async () => ({
        [expectedDerivationPath]: "0x12345123123",
      }),
      finishConnecting: async () => ledgerWalletMock,
    });
    ledgerWalletMock.reMock({
      testConnection: async () => true,
      signMessage: async mess => dummySign(mess),
    });

    // click try again
    mountedComponent
      .find(tid("ledger-wallet-init.try-again"))
      .first()
      .simulate("click");

    await waitForTid(mountedComponent, "wallet-ledger-accounts-table-body");

    // select one of the addresses
    mountedComponent
      .find(`${tid("button-select")}`)
      .first()
      .simulate("click");

    await waitForPredicate(
      () => dispatchSpy.calledWith(actions.routing.goToDashboard()),
      "Navigation to dashboard action",
    );

    expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledOnce;
    expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledWithExactly(
      expectedDerivationPath,
      dummyNetworkId,
    );
    expect(dispatchSpy).calledWithExactly(
      actions.web3.newPersonalWalletPlugged(
        {
          walletType: EWalletType.LEDGER,
          walletSubType: EWalletSubType.UNKNOWN,
          derivationPath: expectedDerivationPath,
          address: expectedAddress,
        },
        true,
      ),
    );
    expect(ledgerWalletMock.signMessage).to.be.calledOnce;
    expect(ledgerWalletMock.signMessage).to.be.calledWithExactly(expectedChallenge);
    expect(signatureAuthApiMock.createJwt).to.be.calledOnce;
    expect(signatureAuthApiMock.createJwt).to.be.calledWithExactly(
      expectedChallenge,
      dummySign(expectedChallenge),
      SignerType.ETH_SIGN,
    );
  });

  it("should select browser wallet", async () => {
    const expectedAddress = dummyEthereumAddress;
    const expectedChallenge = "CHALLENGE";
    const browserWalletMock = createMock(BrowserWallet, {
      walletType: EWalletType.BROWSER,
      walletSubType: EWalletSubType.METAMASK,
      ethereumAddress: expectedAddress,
      getSignerType: () => SignerType.ETH_SIGN_TYPED_DATA,
      getMetadata: (): IBrowserWalletMetadata => ({
        walletType: EWalletType.BROWSER,
        address: expectedAddress,
        walletSubType: EWalletSubType.METAMASK,
      }),
      isUnlocked: () => true,
    });
    const browserWalletConnectorMock = createMock(BrowserWalletConnector, {
      connect: async () => {
        throw new BrowserWalletMissingError();
      },
    });
    const internalWeb3AdapterMock = createMock(Web3Adapter, {
      getBalance: async () => new BigNumber("1"),
    });
    const signatureAuthApiMock = createMock(SignatureAuthApi, {
      challenge: async () => ({
        statusCode: 200,
        body: {
          challenge: expectedChallenge,
        },
      }),
      createJwt: async () => ({
        jwt: jsonwebtoken.sign(
          {
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
            data: "foobar",
          },
          "secret",
        ),
      }),
    });
    const usersApiMock = createMock(UsersApi, {
      me: async () => getDummyUser(browserWalletMock.getMetadata()),
      createAccount: async () => getDummyUser(browserWalletMock.getMetadata()),
    });

    const contractsMock = createMock(ContractsService, {
      identityRegistry: createMock(IdentityRegistry, {
        getClaims: (_userId: string) => Promise.resolve("01001110"),
      }),
    });

    const { store, container, dispatchSpy, history, sagaMiddleware } = createIntegrationTestsSetup({
      browserWalletConnectorMock,
      signatureAuthApiMock,
      usersApiMock,
      storageMock: new Storage({} as any),
      contractsMock,
      initialRoute: appRoutes.register,
      initialState: {
        init: {
          smartcontractsInit: {
            done: true,
          },
        },
      },
    });

    // need to manually initialize, since contract setup is ommitted
    sagaMiddleware.run(function*(): any {
      yield neuCall(initWeb3ManagerEvents);
    });

    container
      .get<Web3ManagerMock>(symbols.web3Manager)
      .initializeMock(internalWeb3AdapterMock, dummyNetworkId);

    const mountedComponent = createMount(
      wrapWithProviders(() => <Route component={WalletSelector} />, {
        container,
        store,
        history,
      }),
    );

    // select wallet in browser tab is selected
    mountedComponent
      .find(tid("wallet-selector-browser"))
      .find(ButtonLink)
      .simulate("click", { button: 0 });
    await waitForTid(mountedComponent, "browser-wallet-error-msg");

    // there is no wallet in browser (BrowserWallet thrown BrowserWalletMissingError)
    expect(
      mountedComponent
        .find(tid("browser-wallet-error-msg"))
        .first()
        .text(),
    ).to.be.eq(
      "Please check if the MetaMask extension is enabled in your browser. We were unable to detect any wallet.",
    );

    // wallet in browser is locked
    browserWalletConnectorMock.reMock({
      connect: async () => {
        throw new BrowserWalletLockedError();
      },
    });
    remount(mountedComponent);

    mountedComponent
      .find(tid("wallet-selector-browser"))
      .find(ButtonLink)
      .simulate("click", { button: 0 });

    await waitForTid(mountedComponent, "browser-wallet-error-msg");

    expect(
      mountedComponent
        .find(tid("browser-wallet-error-msg"))
        .first()
        .text(),
    ).to.be.eq("Your wallet seems to be locked — we can't access any accounts");

    // connect doesn't throw which means there is web3 in browser
    browserWalletMock.reMock({
      testConnection: async () => true,
      signMessage: async mess => dummySign(mess),
    });
    browserWalletConnectorMock.reMock({
      connect: async () => browserWalletMock,
    });

    remount(mountedComponent);

    await waitForPredicate(
      () => dispatchSpy.calledWith(actions.routing.goToDashboard()),
      "Navigation to dashboard action",
    );

    expect(dispatchSpy).calledWithExactly(
      actions.web3.newPersonalWalletPlugged(
        {
          walletType: EWalletType.BROWSER,
          address: expectedAddress,
          walletSubType: EWalletSubType.METAMASK,
        },
        true,
      ),
    );
    expect(browserWalletMock.signMessage).to.be.calledOnce;
    expect(browserWalletMock.signMessage).to.be.calledWithExactly(expectedChallenge);
    expect(signatureAuthApiMock.createJwt).to.be.calledOnce;
    expect(signatureAuthApiMock.createJwt).to.be.calledWithExactly(
      expectedChallenge,
      dummySign(expectedChallenge),
      SignerType.ETH_SIGN_TYPED_DATA,
    );
  });
});

function dummySign(mess: string): string {
  return `SIGNED: ${mess}`;
}
