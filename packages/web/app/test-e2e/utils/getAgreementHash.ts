import { AbiCoder } from "web3-eth-abi";
import { sha3 } from "web3-utils";

import { requestFromWeb3NodeFetch } from "./ethRpcUtils";

const abiCoder = new AbiCoder();

export const {
  UNIVERSE_ADDRESS,
}: any = require("../../../../../git_modules/platform-contracts-artifacts/localhost/meta.json");

let currentStoredAgreement: undefined | string;

// TODO: Wrap getAgreementHash into a Web3 instance
export const getAgreementHash = async () => {
  // This is done for optimization purposes we only need to call the contract one time
  if (currentStoredAgreement) {
    return currentStoredAgreement;
  }
  // Since we are contacting the node directly here we need to prepare the data and parse it
  // Once we move all functions into web3 we don't need encoding/parsing data anymore
  const response = await (
    await requestFromWeb3NodeFetch("eth_call", [
      { to: UNIVERSE_ADDRESS, data: sha3("currentAgreement()").slice(0, 10) },
    ])
  ).json();
  const currentAgreement = abiCoder.decodeParameters(
    ["address", "uint256", "string", "uint256"],
    response.result,
  )[2];
  // Remove `ipfs:` from the response
  currentStoredAgreement = currentAgreement.slice(5);
  return currentStoredAgreement;
};
