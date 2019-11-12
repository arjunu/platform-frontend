import { injectable } from "inversify";

import { EthereumNetworkId } from "../../../utils/opaque-types/types";
import { Web3Adapter } from "../Web3Adapter";
import { Web3Manager } from "./Web3Manager";

@injectable()
export class Web3ManagerMock extends Web3Manager {
  public initializeMock(dummyAdapter: Web3Adapter, networkId: EthereumNetworkId): void {
    this.internalWeb3Adapter = dummyAdapter;
    this.networkId = networkId;
  }
}
