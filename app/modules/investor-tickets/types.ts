import BigNumber from "bignumber.js";
import { TEtoWithCompanyAndContract } from "../public-etos/types";

export interface IInvestorTicket {
  equivEurUlps: BigNumber;
  rewardNmkUlps: BigNumber;
  equityTokenInt: BigNumber;
  sharesInt: BigNumber;
  tokenPrice: BigNumber;
  neuRate: BigNumber;
  amountEth: BigNumber;
  amountEurUlps: BigNumber;
  claimedOrRefunded: boolean;
  usedLockedAccount: boolean;
}

export type TETOWithInvestorTicket = TEtoWithCompanyAndContract & {
  investorTicket: IInvestorTicket;
};
