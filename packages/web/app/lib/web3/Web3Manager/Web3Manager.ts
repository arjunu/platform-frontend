import { BigNumber } from "bignumber.js";
import { EventEmitter } from "events";
import { decorate, inject, injectable } from "inversify";
import * as Web3 from "web3";

import { symbols } from "../../../di/symbols";
import { calculateGasLimitWithOverhead, encodeTransaction } from "../../../modules/tx/utils";
import { EthereumNetworkId } from "../../../types";
import {
  AsyncIntervalScheduler,
  AsyncIntervalSchedulerFactoryType,
} from "../../../utils/AsyncIntervalScheduler";
import { promiseTimeout } from "../../../utils/PromiseUtils";
import { ILogger } from "../../dependencies/logger";
import { LightWallet } from "../light-wallet/LightWallet";
import { IPersonalWallet } from "../PersonalWeb3";
import { IEthereumNetworkConfig } from "../types";
import { Web3Adapter } from "../Web3Adapter";
import { Web3FactoryType } from "../Web3Batch/Web3Batch";

export const DEFAULT_UPPER_GAS_LIMIT = 2000000;
export const DEFAULT_LOWER_GAS_LIMIT = 21000;
export class WalletNotConnectedError extends Error {
  constructor(public readonly wallet: IPersonalWallet) {
    super("Wallet not connected");
  }
}
export class SignerError extends Error {}
export class SignerRejectConfirmationError extends SignerError {}
export class SignerTimeoutError extends SignerError {}
export class SignerUnknownError extends SignerError {}

export const WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL = 5000;

export enum EWeb3ManagerEvents {
  NEW_PERSONAL_WALLET_PLUGGED = "web3_manager_new_personal_wallet_plugged",
  PERSONAL_WALLET_CONNECTION_LOST = "web3_manager_personal_wallet_connection_lost",
}

try {
  // this throws if applied multiple times, which happens in tests
  // that is why the try block is necessary
  decorate(injectable(), EventEmitter);
  // this decorate is necessary for injectable class inheritance
} catch {}

// singleton holding all web3 instances
@injectable()
export class Web3Manager extends EventEmitter {
  public personalWallet?: IPersonalWallet;
  public networkId!: EthereumNetworkId;
  public internalWeb3Adapter!: Web3Adapter;

  constructor(
    @inject(symbols.ethereumNetworkConfig)
    public readonly ethereumNetworkConfig: IEthereumNetworkConfig,
    @inject(symbols.logger) public readonly logger: ILogger,
    @inject(symbols.asyncIntervalSchedulerFactory)
    asyncIntervalSchedulerFactory: AsyncIntervalSchedulerFactoryType,
    @inject(symbols.web3Factory) private web3Factory: Web3FactoryType,
  ) {
    super();
    this.web3ConnectionWatcher = asyncIntervalSchedulerFactory(
      this.watchConnection,
      WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
    );
  }

  private readonly web3ConnectionWatcher: AsyncIntervalScheduler;

  public async initialize(): Promise<void> {
    const web3 = this.web3Factory(
      new Web3.providers.HttpProvider(this.ethereumNetworkConfig.rpcUrl),
    );

    this.internalWeb3Adapter = new Web3Adapter(web3);

    this.networkId = await this.internalWeb3Adapter.getNetworkId();
  }

  public async plugPersonalWallet(personalWallet: IPersonalWallet): Promise<void> {
    // why we are testing connection here? this method is called directly after successful sync
    // todo: remove
    /* const isWalletConnected = await personalWallet.testConnection(this.networkId);
    if (!isWalletConnected) {
      throw new WalletNotConnectedError(personalWallet);
    }*/

    this.personalWallet = personalWallet;

    const isUnlocked =
      this.personalWallet instanceof LightWallet ? !!this.personalWallet.password : true;

    this.emit(EWeb3ManagerEvents.NEW_PERSONAL_WALLET_PLUGGED, {
      isUnlocked,
      metaData: this.personalWallet.getMetadata(),
    });

    this.web3ConnectionWatcher.start();
  }

  public unplugPersonalWallet(): void {
    this.web3ConnectionWatcher.stop();
    this.personalWallet = undefined;
  }

  public async sign(message: string): Promise<string> {
    if (this.personalWallet) {
      return this.personalWallet.signMessage(message);
    } else {
      throw new Error("No wallet!");
    }
  }

  public async sendTransaction(tx: Web3.TxData): Promise<string> {
    if (this.personalWallet) {
      return this.personalWallet.sendTransaction(tx);
    } else {
      throw new Error("No wallet!");
    }
  }

  public async getTransactionByHash(txHash: string): Promise<Web3.Transaction> {
    return this.internalWeb3Adapter.getTransactionByHash(txHash);
  }

  public async getBalance(userAddress: string): Promise<BigNumber> {
    return this.internalWeb3Adapter.getBalance(userAddress);
  }
  public async estimateGas(txData: Partial<Web3.TxData>): Promise<number> {
    const encodedTxData = encodeTransaction(txData);
    return this.internalWeb3Adapter.estimateGas(encodedTxData);
  }

  public async estimateGasWithOverhead(txData: Partial<Web3.TxData>): Promise<string> {
    const gas = await this.estimateGas(txData);
    if (gas < DEFAULT_LOWER_GAS_LIMIT || gas > DEFAULT_UPPER_GAS_LIMIT) {
      this.logger.error(
        new Error(
          `Transaction with very hight/low gas limit VALUE: "${gas.toString()} TX DATA: ${JSON.stringify(
            txData,
          )}`,
        ),
      );
      // No need for overhead in this case
      return DEFAULT_UPPER_GAS_LIMIT.toString();
    }
    // If gas is 21000 it means its a regular transaction
    return gas === DEFAULT_LOWER_GAS_LIMIT ? gas.toString() : calculateGasLimitWithOverhead(gas);
  }

  private watchConnection = async () => {
    this.logger.verbose("Checking web3 status...");
    if (!this.personalWallet) {
      this.logger.error("Web3 watcher started without valid personalWallet instance!");
      return;
    }

    const isConnectionWorking = await promiseTimeout({
      promise: this.personalWallet.testConnection(this.networkId),
      defaultValue: false,
      timeout: WEB3_MANAGER_CONNECTION_WATCHER_INTERVAL,
    });

    if (!isConnectionWorking) {
      this.onWeb3ConnectionLost();
    }
  };

  private onWeb3ConnectionLost = () => {
    this.logger.info("Web3 connection lost");
    this.emit(EWeb3ManagerEvents.PERSONAL_WALLET_CONNECTION_LOST);
    this.web3ConnectionWatcher.stop();
  };
}
