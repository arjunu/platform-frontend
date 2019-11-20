import { ETransactionErrorType, ETxSenderState } from "../../../../modules/tx/sender/reducer";
import { ETxSenderType } from "../../../../modules/tx/types";
import { ITxData } from "./../../../../lib/web3/types";

export interface ITxSenderStateProps {
  isOpen: boolean;
  txTimestamp?: number;
  state: ETxSenderState;
  type?: ETxSenderType;
  details?: ITxData;
  blockId?: number;
  txHash?: string;
  error?: ETransactionErrorType;
}

export interface ITxSenderDispatchProps {
  onCancel: () => void;
}

export type TxSenderProps = ITxSenderStateProps & ITxSenderDispatchProps;
