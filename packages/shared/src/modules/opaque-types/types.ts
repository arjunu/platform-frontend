// opaque types can provide semantic information to simpler types like strings etc
// read: https://codemix.com/opaque-types-in-javascript/
export type Opaque<K, T> = T & { __TYPE__: K };

export type EthereumNetworkId = Opaque<"EthereumNetworkId", string>;
export type EthereumTxHash = Opaque<"EthereumTxHash", string>;
export type EthereumAddress = Opaque<"EthereumAddress", string>;
export type EthereumAddressWithChecksum = Opaque<"EthereumAddressWithChecksum", string>;
export type EquityToken = Opaque<"EquityToken", string>;
