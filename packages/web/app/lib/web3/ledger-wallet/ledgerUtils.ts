import Eth from "@ledgerhq/hw-app-eth";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import createLedgerSubprovider from "@ledgerhq/web3-subprovider";
import * as semver from "semver";
import * as Web3 from "web3";
import * as Web3ProviderEngine from "web3-provider-engine";
// tslint:disable-next-line
import * as RpcSubprovider from "web3-provider-engine/subproviders/rpc";

import { promisify } from "../../../utils/PromiseUtils";
import {
  LedgerContractsDisabledError,
  LedgerNotAvailableError,
  LedgerNotSupportedVersionError,
} from "./errors";
import { ILedgerConfig, ILedgerOutput, IPromisifiedHookedWalletSubProvider } from "./types";

export const minimumLedgerVersion = "1.2.4";

/**
 * PathComponent contains derivation path divided into base path and index.
 * @typedef {Object} PathComponent
 * @property {string} basePath - Base path of derivation path.
 * @property {number} index - index of addresses.
 */

/**
 * Returns derivation path components: base path and index
 * used by getMultipleAccounts.
 * @param derivationPath
 * @returns {PathComponent} PathComponent
 */
export const obtainPathComponentsFromDerivationPath = (derivationPath: string) => {
  // check if derivation path follows 44'/60'/x'/n (ledger native)
  // or 44'/60'/x'/[0|1]/0 (BIP44) pattern
  const regExp = /^(44'\/6[0|1]'\/\d+'?\/(?:[0|1]\/)?)(\d+)$/;
  const matchResult = regExp.exec(derivationPath);
  if (matchResult === null) {
    throw new Error("Derivation path must follow pattern 44'/60|61'/x'/n or BIP 44");
  }

  return { basePath: matchResult[1], index: parseInt(matchResult[2], 10) };
};

export const testConnection = async (getTransport: () => any): Promise<boolean> => {
  try {
    // this check will successfully detect if ledger is locked or disconnected
    await getLedgerConfig(getTransport);
    return true;
  } catch {
    return false;
  }
};

const getLedgerConfig = async (getTransport: () => any): Promise<ILedgerConfig> => {
  const Transport = await getTransport();
  try {
    const ethInstance = new Eth(Transport);

    const configuration = await ethInstance.getAppConfiguration();

    return configuration;
  } catch (e) {
    throw new LedgerNotAvailableError();
  } finally {
    await Transport.close();
  }
};

export const createWeb3WithLedgerProvider = async (
  networkId: string,
  rpcUrl: string,
  getTransport: () => any,
  derivationPath: string,
): Promise<ILedgerOutput> => {
  const engine = new Web3ProviderEngine();

  const ledgerProvider = createLedgerSubprovider(getTransport, {
    networkId,
    path: derivationPath,
  });
  engine.addProvider(ledgerProvider);
  engine.addProvider(
    new RpcSubprovider({
      rpcUrl,
    }),
  );
  engine.start();
  const promisifiedLedgerProvider: IPromisifiedHookedWalletSubProvider = {
    approveMessage: promisify<string>(ledgerProvider.approveMessage),
    approvePersonalMessage: promisify<boolean>(ledgerProvider.approvePersonalMessage),
    approveTransaction: promisify<boolean>(ledgerProvider.approveTransaction),
    approveTypedMessage: promisify<boolean>(ledgerProvider.approveTypedMessage),
    getAccounts: promisify<string[]>(ledgerProvider.getAccounts),
    signPersonalMessage: promisify<string>(ledgerProvider.signPersonalMessage),
    signTransaction: promisify<string>(ledgerProvider.signTransaction),
  };

  return {
    ledgerInstance: { ...promisifiedLedgerProvider, getTransport },
    ledgerWeb3: new Web3(engine),
  };
};

export const connectToLedger = async (): Promise<() => any> => {
  const getTransport = () => TransportU2F.create();

  const ledgerConfig = await getLedgerConfig(getTransport);

  if (semver.lt(ledgerConfig.version, minimumLedgerVersion)) {
    // We support versions newer than 1.2.4
    throw new LedgerNotSupportedVersionError(ledgerConfig.version);
  }

  if (ledgerConfig.arbitraryDataEnabled === 0) {
    throw new LedgerContractsDisabledError();
  }

  return getTransport;
};
