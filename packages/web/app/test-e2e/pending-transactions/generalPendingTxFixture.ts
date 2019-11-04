import { ETxSenderState } from "../../modules/tx/sender/reducer";
import { ETxSenderType } from "../../modules/tx/types";
import { accountFixtureAddress } from "../utils/index";

export const generalPendingTxFixture = {
  transaction: {
    from: accountFixtureAddress("INV_EUR_ICBM_HAS_KYC_SEED"),
    gas: "0xe890",
    gasPrice: "0xd693a400",
    hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    input:
      "0x64663ea600000000000000000000000016cd5ac5a1b77fb72032e3a09e91a98bb21d89880000000000000000000000000000000000000000000000008ac7230489e80000",
    nonce: "0x0",
    to: "0xf538ca71b753e5fa634172c133e5f40ccaddaa80",
    value: "0x1",
    blockHash: undefined,
    blockNumber: undefined,
    chainId: undefined,
    status: undefined,
    transactionIndex: undefined,
    failedRpcError: undefined,
  },
  transactionAdditionalData: {
    to: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988",
    total: "10000000000000000000",
    amount: "10000000000000000000",
    amountEur: "10000000000000000000",
    totalEur: "10000000000000000000",
  },
  transactionStatus: ETxSenderState.MINING,
  transactionTimestamp: 1553762875525,
  transactionType: ETxSenderType.WITHDRAW,
  transactionError: undefined,
};

export const mismatchedPendingTxFixture = {
  ...generalPendingTxFixture,
  transactionAdditionalData: {
    to: "0x16cd5aC5A1b77FB72032E3A09E91A98bB21D8988",
    value: "10000000000000000000",
  },
};
