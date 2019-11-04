import { getOptionalEnv, getRequiredEnv, verifyOptionalFlagEnv } from "./configUtils";

export interface IBackendRoot {
  url: string;
}
export interface IConfig {
  ethereumNetwork: {
    rpcUrl: string;
    backendRpcUrl: string;
  };
  contractsAddresses: {
    universeContractAddress: string;
  };
  backendRoot: IBackendRoot;
  isMochaRunning?: boolean;
}

export function getConfig(env: NodeJS.ProcessEnv): IConfig {
  verifyFeatureFlags(env);

  return {
    ethereumNetwork: {
      rpcUrl: getRequiredEnv(env, "NF_RPC_PROVIDER"),
      backendRpcUrl:
        getOptionalEnv(env, "NF_TRANSACTIONAL_RPC_PROVIDER") ||
        // Falls back to the regular settings when NF_TRANSACTIONAL_RPC_PROVIDER is not provided
        getRequiredEnv(env, "NF_RPC_PROVIDER"),
    },
    contractsAddresses: {
      universeContractAddress: getRequiredEnv(env, "NF_UNIVERSE_CONTRACT_ADDRESS"),
    },
    backendRoot: {
      url: getOptionalEnv(env, "NF_BACKEND_ROOT") || "",
    },
  };
}

/**
 * We do not store feature flags inside the config. We just verify them here and they are accessed directly via process.env to allow easy build optimization.
 */
function verifyFeatureFlags(env: NodeJS.ProcessEnv): void {
  verifyOptionalFlagEnv(env, "NF_FEATURE_EMAIL_CHANGE_ENABLED");
}
