export const lazyLoadIpfsOnlyHash = (): Promise<any> => {
  if (process.env.NF_CYPRESS_RUN === "1") {
    return new Promise(resolve => {
      resolve(require("ipfs-only-hash"));
    });
  } else {
    // comment below is the oficial webpack way to specify a custom name for a chunk, otherwise it's a random string
    return import(/* webpackChunkName: "ipfs-only-hash" */ "ipfs-only-hash");
  }
};
