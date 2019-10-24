import Eth from "@ledgerhq/hw-app-eth";
import { inject, injectable } from "inversify";
import * as Web3 from "web3";

import { symbols } from "../../../di/symbols";
import { EthereumNetworkId } from "../../../types";
import { IEthereumNetworkConfig } from "../types";
import { Web3Adapter } from "../Web3Adapter";
import { LedgerError, LedgerNotAvailableError, LedgerUnknownError } from "./errors";
import {
  connectToLedger,
  createWeb3WithLedgerProvider,
  obtainPathComponentsFromDerivationPath,
  testConnection,
} from "./ledgerUtils";
import { LedgerWallet } from "./LedgerWallet";
import { IDerivationPathToAddress, ILedgerCustomProvider } from "./types";

@injectable()
export class LedgerWalletConnector {
  private web3?: Web3;
  private ledgerInstance?: ILedgerCustomProvider;
  private getTransport?: () => any;

  public constructor(
    @inject(symbols.ethereumNetworkConfig) public readonly web3Config: IEthereumNetworkConfig,
  ) {}

  public async connect(): Promise<void> {
    try {
      this.getTransport = await connectToLedger();
    } catch (e) {
      if (e instanceof LedgerError) {
        throw e;
      } else {
        throw new LedgerUnknownError();
      }
    }
  }

  public async finishConnecting(
    derivationPath: string,
    networkId: EthereumNetworkId,
  ): Promise<LedgerWallet> {
    if (!this.getTransport) throw new LedgerNotAvailableError();

    let providerEngine: any;
    try {
      const { ledgerWeb3, ledgerInstance } = await createWeb3WithLedgerProvider(
        networkId,
        this.web3Config.rpcUrl,
        this.getTransport,
        derivationPath,
      );
      providerEngine = ledgerWeb3.currentProvider;

      this.web3 = ledgerWeb3;
      this.ledgerInstance = ledgerInstance;

      const web3Adapter = new Web3Adapter(this.web3);
      const address = await web3Adapter.getAccountAddress();
      return new LedgerWallet(web3Adapter, address, this.ledgerInstance, derivationPath);
    } catch (e) {
      // we need to explicitly stop Web3 Provider engine
      if (providerEngine) {
        providerEngine.stop();
      }
      throw e;
    }
  }

  public async getMultipleAccountsFromHdPath(
    derivationPaths: string,
    indexOffset: number = 1,
    accountsNo: number = 0,
  ): Promise<IDerivationPathToAddress> {
    if (!this.getTransport) throw new LedgerNotAvailableError();

    const Transport = await this.getTransport();
    try {
      const pathComponents = obtainPathComponentsFromDerivationPath(derivationPaths);

      const chainCode = false; // Include the chain code
      const ethInstance = new Eth(Transport);

      const addresses: IDerivationPathToAddress = {};
      for (let i = indexOffset; i < indexOffset + accountsNo; i += 1) {
        const path = pathComponents.basePath + (pathComponents.index + i).toString();
        const address = await ethInstance.getAddress(path, false, chainCode);
        addresses[path] = address.address;
      }
      return addresses;
    } finally {
      await Transport.close();
    }
  }

  public async getMultipleAccounts(derivationPaths: string[]): Promise<IDerivationPathToAddress> {
    const accounts = await Promise.all(
      derivationPaths.map(path => this.getMultipleAccountsFromHdPath(path, 0, 1)),
    );

    // reduce to single object
    return Object.assign({}, ...accounts);
  }

  public async getMultipleAccountsFromDerivationPrefix(
    derivationPathPrefix: string,
    page: number,
    addressesPerPage: number,
  ): Promise<IDerivationPathToAddress> {
    const derivationPath = derivationPathPrefix + "0";

    return this.getMultipleAccountsFromHdPath(
      derivationPath,
      page * addressesPerPage,
      addressesPerPage,
    );
  }
  public async testConnection(): Promise<boolean> {
    if (!this.getTransport) throw new LedgerNotAvailableError();

    return testConnection(this.getTransport);
  }
}
