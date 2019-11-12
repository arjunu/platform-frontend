import { makeDebugSymbols } from "./symbolsUtils";

export const symbols = makeDebugSymbols({
  // configs
  config: Symbol(),
  ethereumNetworkConfig: Symbol(),
  backendRootConfig: Symbol(),

  // apis
  apiImmutableStorage: Symbol(),
  jsonHttpClient: Symbol(),
  binaryHttpClient: Symbol(),
  authorizedJsonHttpClient: Symbol(),
  authorizedBinaryHttpClient: Symbol(),
  signatureAuthApi: Symbol(),
  vaultApi: Symbol(),
  analyticsApi: Symbol(),
  usersApi: Symbol(),
  apiKycService: Symbol(),
  apiEtoService: Symbol(),
  apiEtoPledgeService: Symbol(),
  apiEtoProductService: Symbol(),
  apiEtoFileService: Symbol(),
  apiEtoNomineeService: Symbol(),
  fileStorageService: Symbol(),
  gasApi: Symbol(),
  marketingEmailsApi: Symbol(),

  // contracts
  contractsService: Symbol(),

  // wallets
  lightWalletUtil: Symbol(),
  lightWalletConnector: Symbol(),
  ledgerWalletConnector: Symbol(),
  browserWalletConnector: Symbol(),
  web3Manager: Symbol(),
  web3Factory: Symbol(),
  web3BatchFactory: Symbol(),

  // storages
  walletStorage: Symbol(),
  documentsConfidentialityAgreementsStorage: Symbol(),
  userStorage: Symbol(),
  jwtStorage: Symbol(),

  // utils
  notificationCenter: Symbol(),
  logger: Symbol(),
  storage: Symbol(),
  asyncIntervalSchedulerFactory: Symbol(),
  detectBrowser: Symbol(),
  userActivityChannel: Symbol(),

  intlWrapper: Symbol(),

  // external modules
  cryptoRandomString: Symbol(),

  // others
  richTextEditorUploadAdapter: Symbol(),
});
