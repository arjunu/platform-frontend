import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import { expectSaga } from "redux-saga-test-plan";
import { spy } from "sinon";

import { dummyEthereumAddress, dummyNetworkId } from "../../../../test/fixtures";
import { createMock } from "../../../../test/testUtils";
import { LedgerErrorMessage } from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import { Neumark } from "../../../lib/contracts/Neumark";
import { ContractsService } from "../../../lib/web3/ContractsService";
import { LedgerNotAvailableError } from "../../../lib/web3/ledger-wallet/errors";
import { LedgerWalletConnector } from "../../../lib/web3/ledger-wallet/LedgerConnector";
import { LedgerWallet } from "../../../lib/web3/ledger-wallet/LedgerWallet";
import { IDerivationPathToAddress } from "../../../lib/web3/ledger-wallet/types";
import { Web3Adapter } from "../../../lib/web3/Web3Adapter";
import { Web3Manager } from "../../../lib/web3/Web3Manager/Web3Manager";
import { IAppState } from "../../../store";
import { Dictionary } from "../../../types";
import { actions } from "../../actions";
import { EWalletSubType, EWalletType, ILedgerWalletMetadata } from "../../web3/types";
import { DEFAULT_DERIVATION_PATH_PREFIX } from "./reducer";
import {
  finishSettingUpLedgerConnector,
  goToNextPageAndLoadData,
  goToPreviousPageAndLoadData,
  loadLedgerAccounts,
  setDerivationPathPrefix,
  tryEstablishingConnectionWithLedger,
} from "./sagas";

describe("Wallet selector > Ledger wizard > actions", () => {
  describe("tryEstablishingConnectionWithLedger", () => {
    it("should try establishing connection", async () => {
      const expectedNetworkId = dummyNetworkId;

      const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
        connect: async () => {},
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
      });

      await expectSaga(tryEstablishingConnectionWithLedger, {
        ledgerWalletConnector: ledgerWalletConnectorMock,
        web3Manager: web3ManagerMock,
      })
        .put(actions.walletSelector.ledgerConnectionEstablished())
        .run();

      expect(ledgerWalletConnectorMock.connect).to.be.calledWithExactly();
    });

    it("should send error action on error", async () => {
      const expectedNetworkId = dummyNetworkId;

      const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
        connect: async () => {
          throw new LedgerNotAvailableError();
        },
      });
      const web3ManagerMock = createMock(Web3Manager, {
        networkId: expectedNetworkId,
      });

      await expectSaga(tryEstablishingConnectionWithLedger, {
        ledgerWalletConnector: ledgerWalletConnectorMock,
        web3Manager: web3ManagerMock,
      })
        .put(
          actions.walletSelector.ledgerConnectionEstablishedError(
            createMessage(LedgerErrorMessage.GENERIC_ERROR),
          ),
        )
        .run();

      expect(ledgerWalletConnectorMock.connect).to.be.calledWithExactly();
    });
  });

  describe("loadLedgerAccountsAction", () => {
    it("should load accounts from ledger connector", async () => {
      const dummyState: Partial<IAppState> = {
        ledgerWizardState: {
          isInitialConnectionInProgress: false,
          index: 1,
          numberOfAccountsPerPage: 10,
          derivationPathPrefix: "44'/60'/0'/",
          accounts: [],
          isLoadingAddresses: false,
          isConnectionEstablished: true,
          advanced: true,
        },
      };
      const expectedAccounts: IDerivationPathToAddress = {
        "44'/60'/0'/1": "0x131213123123",
        "44'/60'/0'/2": "0xab2245c",
      };
      const expectedAccountsToBalancesETH: Dictionary<number> = {
        "0x131213123123": 4,
        "0xab2245c": 15,
      };

      const expectedAccountsToBalancesNEU: Dictionary<number> = {
        "0x131213123123": 40,
        "0xab2245c": 150,
      };

      const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
        getMultipleAccountsFromDerivationPrefix: spy(() => expectedAccounts),
      });
      const web3ManagerMock = createMock(Web3Manager, {
        internalWeb3Adapter: createMock(Web3Adapter, {
          getBalance: (address: string) =>
            Promise.resolve(new BigNumber(expectedAccountsToBalancesETH[address].toString())),
        }),
      });

      const contractsMock = createMock(ContractsService, {
        neumark: createMock(Neumark, {
          balanceOf: (address: string) =>
            Promise.resolve(new BigNumber(expectedAccountsToBalancesNEU[address].toString())),
        }),
      });

      await expectSaga(loadLedgerAccounts, {
        ledgerWalletConnector: ledgerWalletConnectorMock,
        web3Manager: web3ManagerMock,
        contractsService: contractsMock,
      })
        .withState(dummyState)
        .put(
          actions.walletSelector.setLedgerAccounts(
            [
              {
                address: expectedAccounts["44'/60'/0'/1"],
                balanceETH: expectedAccountsToBalancesETH[
                  expectedAccounts["44'/60'/0'/1"]
                ].toString(),
                balanceNEU: expectedAccountsToBalancesNEU[
                  expectedAccounts["44'/60'/0'/1"]
                ].toString(),
                derivationPath: "44'/60'/0'/1",
              },
              {
                address: expectedAccounts["44'/60'/0'/2"],
                balanceETH: expectedAccountsToBalancesETH[
                  expectedAccounts["44'/60'/0'/2"]
                ].toString(),
                balanceNEU: expectedAccountsToBalancesNEU[
                  expectedAccounts["44'/60'/0'/2"]
                ].toString(),
                derivationPath: "44'/60'/0'/2",
              },
            ],
            DEFAULT_DERIVATION_PATH_PREFIX,
          ),
        )
        .run();

      expect(
        ledgerWalletConnectorMock.getMultipleAccountsFromDerivationPrefix,
      ).to.calledWithExactly(
        dummyState.ledgerWizardState!.derivationPathPrefix,
        dummyState.ledgerWizardState!.index,
        dummyState.ledgerWizardState!.numberOfAccountsPerPage,
      );
    });
  });

  describe("goToNextPageAndLoadDataAction", () => {
    it("should work", () =>
      expectSaga(goToNextPageAndLoadData)
        .put(actions.walletSelector.ledgerWizardAccountsListNextPage())
        .put(actions.walletSelector.ledgerLoadAccounts())
        .run());
  });

  describe("goToPreviousPageAndLoadDataAction", () => {
    it("should work", () =>
      expectSaga(goToPreviousPageAndLoadData)
        .put(actions.walletSelector.ledgerWizardAccountsListPreviousPage())
        .put(actions.walletSelector.ledgerLoadAccounts())
        .run());
  });

  describe("setDerivationPathPrefixAction", () => {
    const newDP = "test";
    const dummyState: Partial<IAppState> = {
      ledgerWizardState: {
        isInitialConnectionInProgress: false,
        index: 1,
        numberOfAccountsPerPage: 10,
        derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
        accounts: [],
        isLoadingAddresses: false,
        isConnectionEstablished: true,
        advanced: false,
      },
    };

    it("should do not fire when there is no change in derivationPathPrefix", () =>
      expectSaga(
        setDerivationPathPrefix,
        null,
        actions.walletSelector.ledgerSetDerivationPathPrefix(DEFAULT_DERIVATION_PATH_PREFIX),
      )
        .withState(dummyState)
        .not.put(actions.walletSelector.ledgerLoadAccounts())
        .not.put(actions.walletSelector.setLedgerWizardDerivationPathPrefix(newDP))
        .run());

    it("should fire when there is change in derivationPathPrefix", () =>
      expectSaga(
        setDerivationPathPrefix,
        null,
        actions.walletSelector.ledgerSetDerivationPathPrefix(newDP),
      )
        .withState(dummyState)
        .put(actions.walletSelector.ledgerLoadAccounts())
        .put(actions.walletSelector.setLedgerWizardDerivationPathPrefix(newDP))
        .run());
  });

  describe("finishSettingUpLedgerConnectorAction", () => {
    it("should work when ledger wallet is connected", async () => {
      const expectedNetworkId = dummyNetworkId;

      const expectedDerivationPath = "44'/60'/0'/2";
      const dummyMetadata: ILedgerWalletMetadata = {
        address: dummyEthereumAddress,
        derivationPath: expectedDerivationPath,
        walletType: EWalletType.LEDGER,
        walletSubType: EWalletSubType.UNKNOWN,
      };

      const ledgerWalletMock = createMock(LedgerWallet, {
        getMetadata: (): ILedgerWalletMetadata => dummyMetadata,
      });
      const ledgerWalletConnectorMock = createMock(LedgerWalletConnector, {
        finishConnecting: async () => ledgerWalletMock,
      });

      const web3ManagerMock = createMock(Web3Manager, {
        plugPersonalWallet: async () => {},
        networkId: expectedNetworkId,
      });

      await expectSaga(
        finishSettingUpLedgerConnector,
        {
          ledgerWalletConnector: ledgerWalletConnectorMock,
          web3Manager: web3ManagerMock,
        },
        actions.walletSelector.ledgerFinishSettingUpLedgerConnector(expectedDerivationPath),
      )
        .put(actions.walletSelector.connected())
        .run();

      expect(ledgerWalletConnectorMock.finishConnecting).to.be.calledWithExactly(
        expectedDerivationPath,
        expectedNetworkId,
      );
      expect(web3ManagerMock.plugPersonalWallet).to.be.calledWithExactly(ledgerWalletMock);
    });
  });
});
