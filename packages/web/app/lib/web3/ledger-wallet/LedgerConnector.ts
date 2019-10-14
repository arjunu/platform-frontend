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
      // todo: we must change how it works. now we just create new ledger connection
      // for each call to ledger. that does not make sense
      // we should simply cache transport instance not a function to take transport
      // and simply use it but via a method similar to ensureWalletConnection
      // which will take a method (like getConfig) as side effect and execute it with the open transport
      // if execution fails due to transport being dead etc. (that we need to detect), we just re-open transport
      // and try again ONCE. the infinite loop is done by ensureWalletConnection so no worries about it
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
    if (!this.getTransport) {
      throw new Error("Can't finish not started connection");
    }
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
      this.ledgerInstance = { ...ledgerInstance, getTransport: this.getTransport };
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
  ): Promise<{
    [index: string]: string;
  }> {
    if (!this.getTransport) throw new LedgerNotAvailableError();
    {
      const Transport = await this.getTransport();
      try {
        const pathComponents = obtainPathComponentsFromDerivationPath(derivationPaths);

        const chainCode = false; // Include the chain code
        const ethInstance = new Eth(Transport);

        const addresses: { [index: string]: string } = {};
        for (let i = indexOffset; i < indexOffset + accountsNo; i += 1) {
          const path = pathComponents.basePath + (pathComponents.index + i).toString();
          const address = await ethInstance.getAddress(path, false, chainCode);
          addresses[path] = address.address;
        }
        return addresses;
      } finally {
        Transport.close();
      }
    }
  }

  public async getMultipleAccounts(derivationPaths: string[]): Promise<IDerivationPathToAddress> {
    const accounts: IDerivationPathToAddress = {};

    for (const derivationPath of derivationPaths) {
      if (!this.getTransport) throw new LedgerNotAvailableError();

      const account = await this.getMultipleAccountsFromHdPath(derivationPath, 0, 1);
      Object.assign(accounts, account);
    }

    return accounts;
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
