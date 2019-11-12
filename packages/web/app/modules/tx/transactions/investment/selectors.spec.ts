import { expect } from "chai";

import { addBigNumbers, subtractBigNumbers } from "../../../../utils/BigNumberUtils";
import { convertToUlps } from "../../../../utils/NumberUtils";
import { EInvestmentType } from "../../../investment-flow/reducer";
import { selectTxGasCostEthUlps } from "../../sender/selectors";
import { selectMaximumInvestment } from "./selectors";

const etherTokenLockedBalance = "1.1885479298e+21";
const etherTokenBalance = "226222966567801562965";
const etherBalance = "2.714118602148911016e+21";
const euroTokenBalance = "1.21220093426e+24";
const euroTokenLockedBalance = "7.078801988e+23";

const walletState = {
  wallet: {
    data: {
      euroTokenLockedWallet: {
        LockedBalance: euroTokenLockedBalance,
      },
      etherTokenLockedWallet: {
        LockedBalance: etherTokenLockedBalance,
      },
      etherTokenBalance,
      euroTokenBalance,
      etherBalance,
    },
  },
};

const txState = {
  txSender: {
    type: "INVEST",
    state: "INIT",
    validationState: "validation_ok",
    txDetails: {
      gasPrice: "2400000000",
      gas: "720000",
    },
  },
};

describe("selectMaximumInvestment", () => {
  it("should use entire wallet for LockedEthWallet", () => {
    const state = {
      investmentFlow: {
        ethValueUlps: convertToUlps("1188.5479"),
        investmentType: EInvestmentType.ICBMEth,
      },
      ...walletState,
    } as any;

    const investmentAmount = selectMaximumInvestment(state);

    expect(investmentAmount).eq(etherTokenLockedBalance);
  });

  it("should use user value for LockedEthWallet", () => {
    const ethValueUlps = convertToUlps("1000.5000");
    const state = {
      investmentFlow: {
        ethValueUlps,
        investmentType: EInvestmentType.ICBMEth,
      },
      ...walletState,
    } as any;

    const investmentAmount = selectMaximumInvestment(state);

    expect(investmentAmount).eq(ethValueUlps);
  });

  it("should use entire wallet for EthWallet", () => {
    const ethValueUlps = convertToUlps("2940.3398");
    const balance = addBigNumbers([etherBalance, etherTokenBalance]);
    const state = {
      investmentFlow: {
        ethValueUlps,
        investmentType: EInvestmentType.Eth,
      },
      ...walletState,
      ...txState,
    } as any;

    const gasCostEth = selectTxGasCostEthUlps(state);
    // Whole ETH balance subtracted by gas cost
    const value = subtractBigNumbers([balance, gasCostEth]);

    const investmentAmount = selectMaximumInvestment(state);

    expect(investmentAmount).eq(value);
  });

  it("should use user value for for EthWallet", () => {
    const ethValueUlps = convertToUlps("2000.3398");
    const state = {
      investmentFlow: {
        ethValueUlps,
        investmentType: EInvestmentType.Eth,
      },
      ...walletState,
      ...txState,
    } as any;

    const investmentAmount = selectMaximumInvestment(state);

    expect(investmentAmount).eq(ethValueUlps);
  });

  it("should use entire wallet for for nEURWallet", () => {
    const euroValueUlps = convertToUlps("1212200.93");
    const state = {
      investmentFlow: {
        euroValueUlps,
        investmentType: EInvestmentType.NEur,
      },
      ...walletState,
    } as any;

    const investmentAmount = selectMaximumInvestment(state);

    expect(investmentAmount).eq(euroTokenBalance);
  });

  it("should use user value for for nEURWallet", () => {
    const euroValueUlps = convertToUlps("1200.93");
    const state = {
      investmentFlow: {
        euroValueUlps,
        investmentType: EInvestmentType.NEur,
      },
      ...walletState,
    } as any;

    const investmentAmount = selectMaximumInvestment(state);

    expect(investmentAmount).eq(euroValueUlps);
  });

  it("should use entire wallet for for LockednEURWallet", () => {
    const euroValueUlps = convertToUlps("707880.19");
    const state = {
      investmentFlow: {
        euroValueUlps,
        investmentType: EInvestmentType.ICBMnEuro,
      },
      ...walletState,
    } as any;

    const investmentAmount = selectMaximumInvestment(state);

    expect(investmentAmount).eq(euroTokenLockedBalance);
  });

  it("should use user value for for LockednEURWallet", () => {
    const euroValueUlps = convertToUlps("880.19");
    const state = {
      investmentFlow: {
        euroValueUlps,
        investmentType: EInvestmentType.ICBMnEuro,
      },
      ...walletState,
    } as any;

    const investmentAmount = selectMaximumInvestment(state);

    expect(investmentAmount).eq(euroValueUlps);
  });
});
