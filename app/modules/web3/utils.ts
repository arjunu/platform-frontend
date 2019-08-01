import { isValidChecksumAddress } from "ethereumjs-util";
import { isAddress, toChecksumAddress } from "web3-utils";

import { ERoundingMode } from "../../components/shared/formatters/utils";
import { MONEY_DECIMALS } from "../../config/constants";
import { TBigNumberVariant } from "../../lib/web3/types";
import { EthereumAddress, EthereumAddressWithChecksum, EthereumNetworkId } from "../../types";
import { compareBigNumbers } from "../../utils/BigNumberUtils";
import { formatMoney } from "../../utils/Money.utils";
import { convertToBigInt } from "../../utils/Number.utils";

export function makeEthereumAddressChecksummed(
  ethereumAddress: EthereumAddress,
): EthereumAddressWithChecksum {
  return toChecksumAddress(ethereumAddress) as EthereumAddressWithChecksum;
}

export function ethereumNetworkIdToNetworkName(networkId: EthereumNetworkId): string {
  switch (networkId) {
    case "0":
      return "Dev";
    case "1":
      return "Mainnet";
    case "2":
      return "Morden";
    case "3":
      return "Ropsten";
    case "4":
      return "Rinkeby";
    default:
      return "Unknown";
  }
}

export const validateAddress = (value: string): boolean => {
  const v = value.substring(2);

  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md
  if (v !== v.toUpperCase() && v !== v.toLowerCase()) {
    // Address is checksumed
    return !!value && isAddress(value.toUpperCase()) && isValidChecksumAddress(value);
  } else {
    // Address is not checksumed
    return !!value && isAddress(value.toUpperCase());
  }
};

export const doesUserHaveEnoughEther = (
  value: TBigNumberVariant,
  maxEther: TBigNumberVariant,
): boolean => {
  if (value === "") return false;
  return compareBigNumbers(convertToBigInt(value || "0"), maxEther) < 0;
};

export const doesUserHaveEnoughNEuro = (
  value: TBigNumberVariant,
  maxNEuro: TBigNumberVariant,
): boolean => {
  if (value === "") return false;
  const formattedMax = formatMoney(maxNEuro, MONEY_DECIMALS, 2, ERoundingMode.DOWN);

  return compareBigNumbers(convertToBigInt(value || "0"), convertToBigInt(formattedMax)) <= 0;
};

export const doesUserWithdrawMinimal = (
  value: TBigNumberVariant,
  minNEuro: TBigNumberVariant,
): boolean => {
  if (value === "") return false;
  return compareBigNumbers(convertToBigInt(value || "0"), minNEuro) >= 0;
};
