/**
 *  Cast a `value` to exclude `null` and `undefined`.
 *  Throws if either `null` or `undefined` was passed
 */
import { DataUnavailableError } from "./errors";

export function nonNullable<T>(value: T, message?: string): NonNullable<T> {
  if (value !== undefined && value !== null) {
    return value as NonNullable<T>;
  }

  throw new DataUnavailableError(message || `Non nullable values expected, received ${value}`);
}
