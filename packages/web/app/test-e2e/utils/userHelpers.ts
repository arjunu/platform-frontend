import * as LightWalletProvider from "eth-lightwallet";
import * as ethSig from "eth-sig-util";
import { addHexPrefix, hashPersonalMessage, toBuffer } from "ethereumjs-util";
import { toChecksumAddress } from "web3-utils";

import { TEtoDataWithCompany } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { IUser, OOO_TRANSACTION_TYPE, TxPendingWithMetadata } from "../../lib/api/users/interfaces";
import { getVaultKey } from "../../modules/wallet-selector/light-wizard/utils";
import { promisify } from "../../utils/PromiseUtils";
import { toCamelCase } from "../../utils/transformObjectKeys";
import { assertIsUserVerifiedOnBlockchain, assertLanding } from "./assertions";
import { getAgreementHash } from "./getAgreementHash";
import { accountFixtureByName, removePendingExternalTransaction } from "./index";
import { tid } from "./selectors";

const VAULT_API_ROOT = "/api/wallet";
export const WALLET_STORAGE_KEY = "NF_WALLET_METADATA";
export const JWT_KEY = "NF_JWT";
export const NF_USER_KEY = "NF_USER";

export const generateRandomEmailAddress = () =>
  `${Math.random()
    .toString(36)
    .substring(7)}@e2e.com`;

export const getJwtToken = () => JSON.parse(localStorage.getItem(JWT_KEY)!);
export const getWalletMetaData = () => JSON.parse(localStorage.getItem(WALLET_STORAGE_KEY)!);

type TKycType = "business" | "individual";

type TCreateAndLoginParams = {
  type: TUserType;
  kyc?: TKycType;
  seed?: string;
  hdPath?: string;
  permissions?: string[];
  skipClearingPendingTransactions?: boolean;
  /**
   * In case it's a fixture account you can skip creating new user
   */
  skipCreatingNewUser?: boolean;
  /**
   * Signing TOS is useful to skip when we want to test the TOS modal flow
   * Otherwise we should always sign TOS automatically before even logging in
   */
  skipSigningTOS?: boolean;
  skipBackupCodesVerification?: boolean;
};

/*
 * Pre-login user for faster tests
 */
export const createAndLoginNewUser = ({
  skipClearingPendingTransactions,
  hdPath,
  kyc,
  permissions,
  seed,
  skipSigningTOS,
  skipCreatingNewUser,
  skipBackupCodesVerification,
  type,
}: TCreateAndLoginParams) =>
  cy.clearLocalStorage().then(async ls => {
    cy.log("Logging in...");

    const {
      lightWalletInstance,
      salt,
      address,
      privateKey,
      walletKey,
    } = await createLightWalletWithKeyPair(seed, hdPath);

    // set wallet data on local storage
    ls.setItem(
      WALLET_STORAGE_KEY,
      JSON.stringify({
        address,
        salt,
        userType: type,
        email: `${address.slice(0, 7).toLowerCase()}@neufund.org`,
        walletType: "LIGHT",
      }),
    );

    // fetch a token and store it in local storage
    const jwt = await getJWT(address, lightWalletInstance, walletKey, permissions);
    ls.setItem(JWT_KEY, `"${jwt}"`);
    await createVaultApi(salt, DEFAULT_PASSWORD, lightWalletInstance.serialize());

    if (!skipCreatingNewUser) {
      // create a user object on the backend
      await createUser(type, privateKey, kyc);
    }

    if (!skipBackupCodesVerification) {
      // mark backup codes verified
      await markBackupCodesVerified(jwt);
    }

    if (!skipClearingPendingTransactions) {
      clearPendingTransactions();
    }

    if (!skipSigningTOS) {
      // This was done to maintain `signTosAgreement` without changing the interface of existing tests
      await setCorrectAgreement(jwt);
    }

    if (kyc) {
      // wait for kyc to be properly set as verified on blockchain
      // otherwise UI is not deterministically stable
      assertIsUserVerifiedOnBlockchain(address);
    }

    cy.log(`Logged in as ${type}`, `KYC: ${kyc}, seed: ${seed}`);

    // TODO: find why we need to `cy.wrap` as normal `return { address }` is not working
    return new Promise<{ address: string }>(resolve => resolve(cy.wrap({ address })));
  });

/*
 * Restore fixture account by name
 */
export const loginFixtureAccount = (
  accountFixtureName: string,
  params: Omit<
    Parameters<typeof createAndLoginNewUser>["0"],
    "type" | "seed" | "kyc" | "skipCreatingNewUser"
  > = {},
) => {
  cy.log(`Logging in as ${accountFixtureName}`);

  const fixture = accountFixtureByName(accountFixtureName);

  let hdPath: string | undefined = params.hdPath;

  // in case hd path is not provided derive one from fixture configuration
  if (hdPath === undefined) {
    const hdPathFull = fixture.definition.derivationPath;

    if (hdPathFull) {
      hdPath = hdPathFull.substr(0, hdPathFull.lastIndexOf("/"));
    }
  }

  return createAndLoginNewUser({
    type: fixture.type,
    seed: fixture.definition.seed,
    // fixtures should be already properly populated in the database,
    // therefore there is no need to create new user
    skipCreatingNewUser: true,
    hdPath,
    ...params,
  });
};

/**
 * Create a light wallet with a given seed
 * @param seed
 */
export const DEFAULT_PASSWORD = "strongpassword";
export const DEFAULT_HD_PATH = "m/44'/60'/0'";
export const createLightWalletWithKeyPair = async (
  seed?: string,
  hdPathString: string = DEFAULT_HD_PATH,
) => {
  // promisify some stuff
  const create = promisify<any>(LightWalletProvider.keystore.createVault);

  // create a new wallet
  const entropyStrength = 256;
  seed = seed ? seed : LightWalletProvider.keystore.generateRandomSeed(undefined, entropyStrength);
  const salt = LightWalletProvider.keystore.generateSalt(32);
  const lightWalletInstance = await create({
    password: DEFAULT_PASSWORD,
    seedPhrase: seed,
    hdPathString,
    salt,
  });

  // create keypair
  const keyFromPassword = promisify<any>(
    lightWalletInstance.keyFromPassword.bind(lightWalletInstance),
  );
  const walletKey: any = await keyFromPassword(DEFAULT_PASSWORD);
  lightWalletInstance.generateNewAddress(walletKey, 1);
  let address = lightWalletInstance.getAddresses()[0];
  address = toChecksumAddress(address);
  const privateKey = lightWalletInstance.exportPrivateKey(address, walletKey);

  return { lightWalletInstance, salt, address, privateKey, walletKey };
};

/**
 * Create a user object with the dev services
 * User will have an accepted email address as well as
 * an accepted kyc, if requested
 */
const CREATE_USER_PATH = "/api/external-services-mock/e2e-tests/user/";

type TUserType = "investor" | "issuer" | "nominee";

export const createUser = (userType: TUserType, privateKey?: string, kyc?: TKycType) => {
  let path = `${CREATE_USER_PATH}?user_type=${userType}`;

  if (kyc) {
    path += `&kyc=${kyc}`;
  }

  if (privateKey) {
    path += `&private_key=0x${privateKey}`;
  }

  return fetch(path, {
    method: "POST",
  }).then(r => r.json());
};

/**
 * Get a jwt from the server
 * This could maybe be replaced by a called to the mockservices
 */
const CHALLENGE_PATH = "/api/signature/jwt/challenge";
const JWT_PATH = "/api/signature/jwt/create";

export const getJWT = async (
  address: string,
  lightWalletInstance: any,
  walletKey: any,
  permissions: string[] = [],
): Promise<string> => {
  // first get a challenge
  const headers = {
    "Content-Type": "application/json",
  };
  const challenge_body = {
    address,
    salt: "4abc08069f8c6d26becd80fe96fbeaf4d17b84cdbe7071a8197ab5370bb85876",
    signer_type: "eth_sign",
    permissions: ["sign-tos", ...permissions],
  };
  const ch_response = await fetch(CHALLENGE_PATH, {
    headers,
    method: "POST",
    body: JSON.stringify(challenge_body),
  });
  const ch_result = await ch_response.json();
  const challenge = ch_result.challenge;

  // now sign it...
  const msgHash = hashPersonalMessage(toBuffer(addHexPrefix(challenge)));
  const rawSignedMsg = await LightWalletProvider.signing.signMsgHash(
    lightWalletInstance,
    walletKey,
    msgHash.toString("hex"),
    address,
  );

  // ... and request the jwt
  const signedChallenge = ethSig.concatSig(rawSignedMsg.v, rawSignedMsg.r, rawSignedMsg.s);
  const signed_body = {
    challenge,
    response: signedChallenge,
    signer_type: "eth_sign",
  };
  const sig_response = await fetch(JWT_PATH, {
    headers,
    method: "POST",
    body: JSON.stringify(signed_body),
  });
  const sig_result = await sig_response.json();
  return sig_result.jwt;
};

const USER_PATH = "/api/user/user/me";
const USER_TOS_PATH = USER_PATH + "/tos";

const KYC_PATH = "/api/kyc";
const KYC_STATUS_PATH = "/status";

export const getUserData = async (jwt: string) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${jwt}`,
  };
  return (
    await fetch(USER_PATH, {
      headers,
      method: "GET",
    })
  ).json();
};

export const getKycStatus = async (jwt: string) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${jwt}`,
  };

  const statusResponse = await fetch(KYC_PATH + KYC_STATUS_PATH, {
    headers,
    method: "GET",
  });

  const { status } = await statusResponse.json();

  return status;
};

export const markBackupCodesVerified = async (jwt: string) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${jwt}`,
  };

  const userJson = await getUserData(jwt);

  userJson.backup_codes_verified = true;
  await fetch(USER_PATH, {
    headers,
    method: "PUT",
    body: JSON.stringify(userJson),
  });
};

export const setCorrectAgreement = async (jwt: string) => {
  const headers = {
    "Content-Type": "application/json",
    authorization: `Bearer ${jwt}`,
  };

  const TosAgreementFromUniverse = await getAgreementHash();

  await fetch(USER_TOS_PATH, {
    headers,
    method: "PUT",
    body: JSON.stringify({
      latest_accepted_tos_ipfs: TosAgreementFromUniverse,
    }),
  });
};

const PENDING_TRANSACTIONS_PATH = "/api/user/pending_transactions/me";

export const addPendingTransactions = (
  tx: TxPendingWithMetadata,
): Cypress.Chainable<ReadonlyArray<{ transaction_type: string }>> =>
  cy
    .request({
      url: PENDING_TRANSACTIONS_PATH,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getJwtToken()}`,
      },
      body: {
        transaction: tx.transaction,
        transaction_type: tx.transactionType,
        transaction_additional_data: tx.transactionAdditionalData,
        transaction_timestamp: tx.transactionTimestamp,
        transaction_status: tx.transactionStatus,
        transaction_error: tx.transactionError,
      },
    })
    .then(response => response.body);

const MOCKED_PENDING_TX_PATH = "/api/external-services-mock/e2e-tests/pending_transactions/";

export const addFailedPendingTransactions = (
  uid: string,
  txHash: string,
  error: string,
): Cypress.Chainable<ReadonlyArray<{ transaction_type: string }>> =>
  cy
    .request({
      url: `${MOCKED_PENDING_TX_PATH}${uid}/failed/${txHash}?error=${error}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getJwtToken()}`,
      },
    })
    .then(response => response.body);

export const clearPendingTransactions = () =>
  cy
    .request({
      url: PENDING_TRANSACTIONS_PATH,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getJwtToken()}`,
      },
    })
    .then(async response => {
      const pendingTransactions = response.body;
      await pendingTransactions.map((tx: any) =>
        // no deserializer used, parse snake case
        tx.transaction_type === OOO_TRANSACTION_TYPE
          ? removePendingExternalTransaction()
          : cy.request({
              url: `${PENDING_TRANSACTIONS_PATH}/${tx.transaction.hash}`,
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${getJwtToken()}`,
              },
            }),
      );
    });

export const getPendingTransactions = (): Cypress.Chainable<ReadonlyArray<{
  transaction_type: string;
}>> =>
  cy
    .request({
      url: PENDING_TRANSACTIONS_PATH,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getJwtToken()}`,
      },
    })
    .then(response => response.body);

export const makeAuthenticatedCall = (path: string, config: RequestInit = {}) =>
  fetch(path, {
    ...config,
    headers: {
      ...config.headers,
      "Content-Type": "application/json",
      authorization: `Bearer ${getJwtToken()}`,
    },
  }).then(r => r.json());

export const logout = () => {
  cy.log("logging out");

  cy.get(tid("account-menu-open-button"))
    .click()
    .get(tid("menu-logout-button"))
    .click();

  assertLanding();

  cy.log("logged out");
};

export const createVaultApi = async (
  salt: string,
  password: string,
  serializedVault: string,
): Promise<any> => {
  const vaultKey = await getVaultKey(salt, password);

  const path = `${VAULT_API_ROOT}/vault/${vaultKey}`;
  const payload = { wallet: serializedVault };
  return fetch(path, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
  });
};

const ETOS_PATH = "/api/eto-listing/etos";

export interface IHttpPartialResponse<T> {
  body: T;
}

export const getEto = (etoID: string): Cypress.Chainable<TEtoDataWithCompany> => {
  if (!etoID) {
    throw new Error("Cannot fetch undefined value please check if the fixtures are in sync");
  }

  return cy
    .request({ url: ETOS_PATH, method: "GET" })
    .then((etos: IHttpPartialResponse<TEtoDataWithCompany>) => {
      if (!etos.body) {
        throw new Error(`There is no body response from ${ETOS_PATH} ping backend about this`);
      }

      const result: TEtoDataWithCompany[] = toCamelCase(etos.body).filter(
        (eto: TEtoDataWithCompany) => eto.etoId === etoID,
      );

      if (result.length === 0) {
        throw new Error(
          "Something is wrong with the fixtures, this sometimes happens due to users changing fixtures from the platform. ",
        );
      }
      // If there is more than one eto just return the first one
      return result[0];
    });
};

const EMAIL_VERIFICATION_PATH = USER_PATH + "/email-verification";

export const verifyUserEmailCall = (activationLink: string): Cypress.Chainable<IUser> => {
  const activationLinkURL = new URL(activationLink);
  const activationLinkParams = new URLSearchParams(activationLinkURL.search);
  const verificationCode = activationLinkParams.get("code")!;

  return cy
    .request({
      url: EMAIL_VERIFICATION_PATH,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${getJwtToken()}`,
      },
      body: JSON.stringify({ verification_code: verificationCode }),
    })
    .then(response => response.body);
};
