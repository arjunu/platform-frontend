import * as cryptoRandomString from "crypto-random-string";
import { Container } from "inversify";

import { IBackendRoot, IConfig } from "../config/getConfig";
import { AnalyticsApi } from "../lib/api/analytics-api/AnalyticsApi";
import { SignatureAuthApi } from "../lib/api/auth/SignatureAuthApi";
import { AuthorizedBinaryHttpClient } from "../lib/api/client/AuthBinaryHttpClient";
import { AuthorizedJsonHttpClient } from "../lib/api/client/AuthJsonHttpClient";
import { BinaryHttpClient } from "../lib/api/client/BinaryHttpClient";
import { IHttpClient } from "../lib/api/client/IHttpClient";
import { JsonHttpClient } from "../lib/api/client/JsonHttpClient";
import { EtoApi } from "../lib/api/eto/EtoApi";
import { EtoFileApi } from "../lib/api/eto/EtoFileApi";
import { EtoNomineeApi } from "../lib/api/eto/EtoNomineeApi";
import { EtoPledgeApi } from "../lib/api/eto/EtoPledgeApi";
import { EtoProductApi } from "../lib/api/eto/EtoProductApi";
import { FileStorageApi } from "../lib/api/file-storage/FileStorageApi";
import {
  richTextEditorUploadAdapterFactory,
  TRichTextEditorUploadAdapterFactoryType,
} from "../lib/api/file-storage/RichTextEditorUploadAdapter";
import { GasApi } from "../lib/api/gas/GasApi";
import { ImmutableStorageApi } from "../lib/api/immutable-storage/ImmutableStorageApi";
import { KycApi } from "../lib/api/kyc/KycApi";
import { MarketingEmailsApi } from "../lib/api/users/MarketingEmailsApi";
import { UsersApi } from "../lib/api/users/UsersApi";
import { VaultApi } from "../lib/api/vault/VaultApi";
import {
  BroadcastChannel,
  createNewBroadcastChannel,
} from "../lib/dependencies/broadcast-channel/broadcastChannel";
import { UserActivityChannelMessage } from "../lib/dependencies/broadcast-channel/types";
import { detectBrowser, TDetectBrowser } from "../lib/dependencies/detectBrowser";
import { ILogger, Logger } from "../lib/dependencies/logger";
import { NotificationCenter } from "../lib/dependencies/NotificationCenter";
import { IntlWrapper } from "../lib/intl/IntlWrapper";
import { DocumentsConfidentialityAgreementsStorage } from "../lib/persistence/DocumentsConfidentialityAgreementsStorage";
import { STORAGE_JWT_KEY } from "../lib/persistence/JwtObjectStorage";
import { ObjectStorage } from "../lib/persistence/ObjectStorage";
import { Storage } from "../lib/persistence/Storage";
import { USER_JWT_KEY } from "../lib/persistence/UserStorage";
import { WalletStorage } from "../lib/persistence/WalletStorage";
import { BrowserWalletConnector } from "../lib/web3/browser-wallet/BrowserWallet";
import { ContractsService } from "../lib/web3/ContractsService";
import { LedgerWalletConnector } from "../lib/web3/ledger-wallet/LedgerConnector";
import { LightWalletConnector } from "../lib/web3/light-wallet/LightWallet";
import { IEthereumNetworkConfig } from "../lib/web3/types";
import {
  web3BatchFactory,
  Web3BatchFactoryType,
  web3Factory,
  Web3FactoryType,
} from "../lib/web3/Web3Batch/Web3Batch";
import { Web3Manager } from "../lib/web3/Web3Manager/Web3Manager";
import {
  AsyncIntervalSchedulerFactory,
  AsyncIntervalSchedulerFactoryType,
} from "../utils/AsyncIntervalScheduler";
import { symbols } from "./symbols";

export function setupBindings(config: IConfig): Container {
  const container = new Container();

  // functions
  container
    .bind<typeof cryptoRandomString>(symbols.cryptoRandomString)
    .toConstantValue(cryptoRandomString);
  container.bind<TDetectBrowser>(symbols.detectBrowser).toConstantValue(detectBrowser);

  // configs
  container
    .bind<IEthereumNetworkConfig>(symbols.ethereumNetworkConfig)
    .toConstantValue(config.ethereumNetwork);
  container.bind<IConfig>(symbols.config).toConstantValue(config);

  container.bind<IBackendRoot>(symbols.backendRootConfig).toConstantValue(config.backendRoot);

  container
    .bind<ILogger>(symbols.logger)
    .to(Logger)
    .inSingletonScope();

  // classes
  container
    .bind<IHttpClient>(symbols.jsonHttpClient)
    .to(JsonHttpClient)
    .inSingletonScope();
  container
    .bind<IHttpClient>(symbols.binaryHttpClient)
    .to(BinaryHttpClient)
    .inSingletonScope();
  container
    .bind<IHttpClient>(symbols.authorizedJsonHttpClient)
    .to(AuthorizedJsonHttpClient)
    .inSingletonScope();
  container
    .bind<IHttpClient>(symbols.authorizedBinaryHttpClient)
    .to(AuthorizedBinaryHttpClient)
    .inSingletonScope();

  // singletons
  container
    .bind<SignatureAuthApi>(symbols.signatureAuthApi)
    .to(SignatureAuthApi)
    .inSingletonScope();

  container
    .bind<VaultApi>(symbols.vaultApi)
    .to(VaultApi)
    .inSingletonScope();

  container
    .bind<AnalyticsApi>(symbols.analyticsApi)
    .to(AnalyticsApi)
    .inSingletonScope();

  container
    .bind<UsersApi>(symbols.usersApi)
    .to(UsersApi)
    .inSingletonScope();

  container
    .bind<NotificationCenter>(symbols.notificationCenter)
    .to(NotificationCenter)
    .inSingletonScope();

  container
    .bind<MarketingEmailsApi>(symbols.marketingEmailsApi)
    .to(MarketingEmailsApi)
    .inSingletonScope();

  // web3 & blockchain
  container
    .bind(symbols.contractsService)
    .to(ContractsService)
    .inSingletonScope();
  container
    .bind<LedgerWalletConnector>(symbols.ledgerWalletConnector)
    .to(LedgerWalletConnector)
    .inSingletonScope();

  container
    .bind<LightWalletConnector>(symbols.lightWalletConnector)
    .to(LightWalletConnector)
    .inSingletonScope();

  container
    .bind<BrowserWalletConnector>(symbols.browserWalletConnector)
    .to(BrowserWalletConnector)
    .inSingletonScope();

  container
    .bind<Web3Manager>(symbols.web3Manager)
    .to(Web3Manager)
    .inSingletonScope();

  container
    .bind<KycApi>(symbols.apiKycService)
    .to(KycApi)
    .inSingletonScope();
  container
    .bind<EtoApi>(symbols.apiEtoService)
    .to(EtoApi)
    .inSingletonScope();
  container
    .bind<EtoPledgeApi>(symbols.apiEtoPledgeService)
    .to(EtoPledgeApi)
    .inSingletonScope();
  container
    .bind<EtoProductApi>(symbols.apiEtoProductService)
    .to(EtoProductApi)
    .inSingletonScope();
  container
    .bind<EtoFileApi>(symbols.apiEtoFileService)
    .to(EtoFileApi)
    .inSingletonScope();
  container
    .bind<EtoNomineeApi>(symbols.apiEtoNomineeService)
    .to(EtoNomineeApi)
    .inSingletonScope();
  container
    .bind(symbols.fileStorageService)
    .to(FileStorageApi)
    .inSingletonScope();
  container
    .bind(symbols.apiImmutableStorage)
    .to(ImmutableStorageApi)
    .inSingletonScope();
  container
    .bind(symbols.gasApi)
    .to(GasApi)
    .inSingletonScope();

  // persistence storage
  container.bind<Storage>(symbols.storage).toConstantValue(new Storage(window.localStorage));
  container
    .bind<WalletStorage>(symbols.walletStorage)
    .to(WalletStorage)
    .inSingletonScope();
  container
    .bind<DocumentsConfidentialityAgreementsStorage>(
      symbols.documentsConfidentialityAgreementsStorage,
    )
    .to(DocumentsConfidentialityAgreementsStorage)
    .inSingletonScope();
  container
    .bind<ObjectStorage<string>>(symbols.jwtStorage)
    .toDynamicValue(
      ctx =>
        new ObjectStorage<string>(
          ctx.container.get(symbols.storage),
          ctx.container.get(symbols.logger),
          STORAGE_JWT_KEY,
        ),
    )
    .inSingletonScope();
  container
    .bind<ObjectStorage<string>>(symbols.userStorage)
    .toDynamicValue(
      ctx =>
        new ObjectStorage<string>(
          ctx.container.get(symbols.storage),
          ctx.container.get(symbols.logger),
          USER_JWT_KEY,
        ),
    )
    .inSingletonScope();

  // factories
  container
    .bind<AsyncIntervalSchedulerFactoryType>(symbols.asyncIntervalSchedulerFactory)
    .toFactory(AsyncIntervalSchedulerFactory);

  container
    .bind<TRichTextEditorUploadAdapterFactoryType>(symbols.richTextEditorUploadAdapter)
    .toFactory(richTextEditorUploadAdapterFactory);

  container.bind<Web3FactoryType>(symbols.web3Factory).toFactory(web3Factory);

  container.bind<Web3BatchFactoryType>(symbols.web3BatchFactory).toFactory(web3BatchFactory);

  container.bind(symbols.intlWrapper).toConstantValue(new IntlWrapper());
  container
    .bind(symbols.userActivityChannel)
    .toDynamicValue(() =>
      createNewBroadcastChannel<UserActivityChannelMessage>(symbols.userActivityChannel.toString()),
    )
    .inSingletonScope();

  return container;
}

/**
 * We use plain object for injecting deps into sagas
 */
export const createGlobalDependencies = (container: Container) => ({
  // misc
  logger: container.get<ILogger>(symbols.logger),
  notificationCenter: container.get<NotificationCenter>(symbols.notificationCenter),

  cryptoRandomString: container.get<typeof cryptoRandomString>(symbols.cryptoRandomString),
  detectBrowser: container.get<TDetectBrowser>(symbols.detectBrowser),

  // blockchain & wallets
  contractsService: container.get<ContractsService>(symbols.contractsService),
  web3Manager: container.get<Web3Manager>(symbols.web3Manager),
  lightWalletConnector: container.get<LightWalletConnector>(symbols.lightWalletConnector),
  browserWalletConnector: container.get<BrowserWalletConnector>(symbols.browserWalletConnector),
  ledgerWalletConnector: container.get<LedgerWalletConnector>(symbols.ledgerWalletConnector),

  // storage
  jwtStorage: container.get<ObjectStorage<string>>(symbols.jwtStorage),
  walletStorage: container.get<WalletStorage>(symbols.walletStorage),
  documentsConfidentialityAgreementsStorage: container.get<
    DocumentsConfidentialityAgreementsStorage
  >(symbols.documentsConfidentialityAgreementsStorage),
  userStorage: container.get<ObjectStorage<string>>(symbols.userStorage),

  // network layer
  binaryHttpClient: container.get<BinaryHttpClient>(symbols.binaryHttpClient),
  jsonHttpClient: container.get<JsonHttpClient>(symbols.jsonHttpClient),
  authorizedJsonHttpClient: container.get<AuthorizedJsonHttpClient>(
    symbols.authorizedJsonHttpClient,
  ),
  authorizedBinaryHttpClient: container.get<AuthorizedBinaryHttpClient>(
    symbols.authorizedBinaryHttpClient,
  ),

  // apis
  signatureAuthApi: container.get<SignatureAuthApi>(symbols.signatureAuthApi),
  apiKycService: container.get<KycApi>(symbols.apiKycService),
  apiEtoService: container.get<EtoApi>(symbols.apiEtoService),
  apiEtoPledgeService: container.get<EtoPledgeApi>(symbols.apiEtoPledgeService),
  apiEtoProductService: container.get<EtoProductApi>(symbols.apiEtoProductService),
  apiEtoFileService: container.get<EtoFileApi>(symbols.apiEtoFileService),
  apiEtoNomineeService: container.get<EtoNomineeApi>(symbols.apiEtoNomineeService),
  apiUserService: container.get<UsersApi>(symbols.usersApi),
  vaultApi: container.get<VaultApi>(symbols.vaultApi),
  analyticsApi: container.get<AnalyticsApi>(symbols.analyticsApi),
  fileStorageApi: container.get<FileStorageApi>(symbols.fileStorageService),
  gasApi: container.get<GasApi>(symbols.gasApi),
  apiImmutableStorage: container.get<ImmutableStorageApi>(symbols.apiImmutableStorage),
  marketingEmailsApi: container.get<MarketingEmailsApi>(symbols.marketingEmailsApi),

  intlWrapper: container.get<IntlWrapper>(symbols.intlWrapper),
  userActivityChannel: container.get<BroadcastChannel<UserActivityChannelMessage>>(
    symbols.userActivityChannel,
  ),
});

export type TGlobalDependencies = ReturnType<typeof createGlobalDependencies>;
