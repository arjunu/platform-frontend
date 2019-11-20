export enum EEventEmitterChannelEvents {
  NEW_BLOCK = "NEW_BLOCK",
  TX_MINED = "TX_MINED",
  ERROR = "ERROR",
  REVERTED_TRANSACTION = "REVERTED_TRANSACTION",
  OUT_OF_GAS = "OUT_OF_GAS",
  CANCELLED = "CANCELLED",
}

export type TEventEmitterChannelEvents =
  | {
      type: EEventEmitterChannelEvents.NEW_BLOCK;
      blockId: number;
    }
  | {
      type: EEventEmitterChannelEvents.CANCELLED;
      error: Error;
    }
  | {
      type: EEventEmitterChannelEvents.TX_MINED;
    }
  | {
      type: EEventEmitterChannelEvents.ERROR;
      error: Error;
    }
  | {
      type: EEventEmitterChannelEvents.REVERTED_TRANSACTION;
      error: Error;
    }
  | {
      type: EEventEmitterChannelEvents.OUT_OF_GAS;
      error: Error;
    };
