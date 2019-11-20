export const isGaslessTxEnabled = !!(
  process.env.NF_TRANSACTIONAL_RPC_PROVIDER && process.env.NF_TRANSACTIONAL_RPC_PROVIDER !== ""
);
