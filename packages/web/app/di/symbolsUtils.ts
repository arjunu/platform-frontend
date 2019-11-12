import { mapValues } from "lodash";

/**
 * Adds automatically symbols name values which makes debugging easier
 */
export function makeDebugSymbols<T>(symbols: T): T {
  return mapValues(symbols as any, (_, key) => Symbol.for(key)) as any;
}
