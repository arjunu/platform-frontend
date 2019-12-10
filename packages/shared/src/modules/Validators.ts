const DERIVATION_PATH_PREFIX_REGEX = /^(44'\/6[0|1]'\/\d+'?\/(?:[0|1]\/)?)$/;

export const derivationPathPrefixValidator = (dp: string): string | null => {
  if (!DERIVATION_PATH_PREFIX_REGEX.test(dp)) {
    return "Invalid derivation path prefix! Example of valid ones are \"44'/60'/0'\" (ledger) or \"44'/60'/0'/0\" (BIP44)";
  }
  return null;
};
