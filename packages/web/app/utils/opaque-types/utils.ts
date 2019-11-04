import { EquityToken, EthereumAddress } from "./types";

const toEquityTokenSymbol = (symbol: string) => symbol as EquityToken;

const toEthereumAddress = (address: string) => address as EthereumAddress;

export { toEquityTokenSymbol, toEthereumAddress };
