import PubKeyBroadcastChannel from "broadcast-channel";

export const createNewBroadcastChannel = <T>(key: string): PubKeyBroadcastChannel<T> =>
  // Currently we will only force localstorage until issue 29 is solved
  //@SEE https://github.com/pubkey/broadcast-channel/issues/29
  new PubKeyBroadcastChannel(key, {
    webWorkerSupport: false,
  });

export type BroadcastChannel<T> = PubKeyBroadcastChannel<T>;
