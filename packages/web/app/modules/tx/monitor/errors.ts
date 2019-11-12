import { ETxSenderType } from "../types";

export class TxMonitorError extends Error {}

export class SchemaMismatchError extends TxMonitorError {
  constructor(type: ETxSenderType) {
    super(`Invalid schema received from pending transactions for ${type}`);
  }
}
