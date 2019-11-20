import BigNumber from "bignumber.js";
import { mapValues } from "lodash";

import { TBigNumberVariants } from "./../../lib/web3/types";

export function numericValuesToString<T extends Record<keyof T, TBigNumberVariants>>(
  entity: T,
): Record<keyof T, string> {
  return mapValues<T, string>(entity, e => e.toString());
}

/* generate posix timestamp from day of epoch used as snapshotId in contracts. */
/* @see https://github.com/Neufund/EIPs/blob/token-with-snapshots/eip-token-with-snapshots.md */
export const calculateSnapshotDate = (val: BigNumber) => {
  const divider = new BigNumber("2").pow(128);
  const secondsInDay = new BigNumber("86400");

  return new BigNumber(val)
    .div(divider)
    .mul(secondsInDay)
    .toNumber();
};
