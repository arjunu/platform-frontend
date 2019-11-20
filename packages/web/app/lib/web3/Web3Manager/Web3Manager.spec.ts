import { expect } from "chai";
import { spy } from "sinon";
import * as Web3 from "web3";

import { dummyConfig, dummyEthereumAddress, dummyNetworkId } from "../../../../test/fixtures";
import { createMock } from "../../../../test/testUtils";
import { EWalletSubType, EWalletType, ILedgerWalletMetadata } from "../../../modules/web3/types";
import { noopLogger } from "../../dependencies/logger";
import { LedgerWallet } from "../ledger-wallet/LedgerWallet";
import { EWeb3ManagerEvents, Web3Manager } from "./Web3Manager";

describe("Web3Manager", () => {
  const expectedNetworkId = dummyNetworkId;

  it("should plug personal wallet when connection works", async () => {
    const expectedDerivationPath = "44'/60'/0'/1";
    const pluggedListener = spy();
    const ledgerWalletMock = createMock(LedgerWallet, {
      ethereumAddress: dummyEthereumAddress,
      testConnection: async () => true,
      walletType: EWalletType.LEDGER,
      walletSubType: EWalletSubType.UNKNOWN,
      derivationPath: expectedDerivationPath,
      getMetadata: (): ILedgerWalletMetadata => ({
        walletType: EWalletType.LEDGER,
        walletSubType: EWalletSubType.UNKNOWN,
        derivationPath: expectedDerivationPath,
        address: dummyEthereumAddress,
      }),
      isUnlocked: () => true,
    });

    const web3FactoryMock = (...args: any[]) => new Web3(...args);

    const web3Manager = new Web3Manager(dummyConfig.ethereumNetwork, noopLogger, web3FactoryMock);
    web3Manager.networkId = expectedNetworkId;
    web3Manager.on(EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, pluggedListener);

    await web3Manager.plugPersonalWallet(ledgerWalletMock);

    expect(web3Manager.personalWallet).to.be.eq(ledgerWalletMock);
    expect(pluggedListener).to.be.calledWithExactly({
      metaData: {
        address: dummyEthereumAddress,
        walletType: EWalletType.LEDGER,
        walletSubType: EWalletSubType.UNKNOWN,
        derivationPath: expectedDerivationPath,
      },
      isUnlocked: true,
    });
  });
});
