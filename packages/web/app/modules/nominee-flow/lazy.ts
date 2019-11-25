export const generateHash = (buffer: Buffer): Promise<string> =>
  import("ipfs-only-hash").then((Hash: IpfsHasher) => Hash.of(buffer));
