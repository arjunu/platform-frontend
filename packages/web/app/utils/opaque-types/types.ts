import { Opaque } from "../../types";

export type EthereumNetworkId = Opaque<"EthereumNetworkId", string>;
export type EthereumTxHash = Opaque<"EthereumTxHash", string>;
export type EthereumAddress = Opaque<"EthereumAddress", string>;
export type EthereumAddressWithChecksum = Opaque<"EthereumAddressWithChecksum", string>;
export type FunctionWithDeps = Opaque<"FunctionWithDeps", Function>;
export type EquityToken = Opaque<"EquityToken", string>;
