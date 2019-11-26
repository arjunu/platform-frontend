declare module "ipfs-only-hash";

declare type IpfsHasher = {
  of: (buffer: Buffer) => string;
};
