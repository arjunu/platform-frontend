import { expectSaga } from "@neufund/sagas"
import * as matchers from "redux-saga-test-plan/matchers";

import { createMock } from "../../../../../test/testUtils";
import { EtherToken } from "../../../../lib/contracts/EtherToken";
import { IERC223Token } from "../../../../lib/contracts/IERC223Token";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { IAppState } from "../../../../store";
import { toEthereumAddress } from "../../../../utils/opaque-types/utils";
import { getDummyLightWalletMetadata } from "../../../web3/fixtures";
import { generateTokenWithdrawTransaction, isERC223TransferSupported } from "./sagas";

describe("Token Transfer Sagas", () => {
  const generalMockedState: Partial<IAppState> = {
    web3: {
      connected: false,
      previousConnectedWallet: getDummyLightWalletMetadata(),
    },
    gas: {
      gasPrice: { standard: "1000", fast: "0", fastest: "0", safeLow: "0" },
      loading: false,
    },
  };

  const tokenAddress = toEthereumAddress("0x8a588917c83462C0B602904F6cE6a558aeBc5683");
  const to = "0x8a588917c83462C0B602904F6cE6a558aeBc5683";

  const web3ManagerMock = {
    internalWeb3Adapter: { isSmartContract: () => true } as any,
    estimateGas: () => Promise.resolve(1),
    estimateGasWithOverhead: () => Promise.resolve("9"),
  } as any;

  const Erc223TransferTx = Symbol();
  const Erc223TransferData = Symbol();
  const EtherTokenTransferData = Symbol();

  const contractsMock = createMock(ContractsService, {
    etherToken: createMock(EtherToken, {
      rawWeb3Contract: {
        transfer: {
          "address,uint256,bytes": {
            getData: () => EtherTokenTransferData,
          },
        },
      },
    }),
    getERC223: () =>
      Promise.resolve(
        createMock(IERC223Token, {
          transferTx: () =>
            ({
              getData: () => Erc223TransferTx,
            } as any),
          rawWeb3Contract: {
            transfer: {
              "address,uint256,bytes": {
                getData: () => Erc223TransferData,
              },
            },
          },
        }),
      ),
  });

  describe("transactionGenerator", () => {
    it("Uses Erc233 Transfer type", async () => {
      await expectSaga(
        generateTokenWithdrawTransaction as any,
        {
          web3Manager: web3ManagerMock,
          contractsService: contractsMock,
        },
        {
          tokenAddress,
          to,
          valueUlps: "1232323",
        },
      )
        .withState(generalMockedState)
        .provide([[matchers.call.fn(isERC223TransferSupported), false]])
        .returns({
          to: tokenAddress,
          from: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
          data: Erc223TransferTx,
          value: "0",
          gasPrice: generalMockedState.gas!.gasPrice!.standard,
          gas: "9",
        })
        .run();
    });
    it("Uses ERC20 Transfer type", async () => {
      await expectSaga(
        generateTokenWithdrawTransaction as any,
        {
          web3Manager: web3ManagerMock,
          contractsService: contractsMock,
        },
        {
          tokenAddress,
          to,
          valueUlps: "1232323",
        },
      )
        .withState(generalMockedState)
        .provide([[matchers.call.fn(isERC223TransferSupported), true]])
        .returns({
          to: tokenAddress,
          from: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359",
          data: Erc223TransferData,
          value: "0",
          gasPrice: generalMockedState.gas!.gasPrice!.standard,
          gas: "9",
        })
        .run();
    });
  });
});
