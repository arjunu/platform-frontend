import { branch, compose } from "recompose";

import { actions } from "../../../../../modules/actions";
import { ETransactionErrorType } from "../../../../../modules/tx/sender/reducer";
import {
  selectTxAdditionalData,
  selectTxGasCostEthUlps,
} from "../../../../../modules/tx/sender/selectors";
import { TWithdrawAdditionalData } from "../../../../../modules/tx/transactions/withdraw/types";
import { ETxSenderType } from "../../../../../modules/tx/types";
import {
  selectUserFlowTokenDecimals,
  selectUserFlowTokenImage,
  selectUserFlowTokenSymbol,
} from "../../../../../modules/tx/user-flow/transfer/selectors";
import { selectEthereumAddressWithChecksum } from "../../../../../modules/web3/selectors";
import { appConnect } from "../../../../../store";
import { RequiredByKeys } from "../../../../../types";
import { EquityToken } from "../../../../../utils/opaque-types/types";
import { ETxStatus } from "../../types";

export interface ITransferTransactionExternalProps {
  txHash?: string;
  blockId?: number;
  txTimestamp?: number;
  walletAddress?: string;
  error?: ETransactionErrorType;
}

export interface ITransferTransactionInternalProps {
  status: ETxStatus;
  "data-test-id"?: string;
  isMined: boolean;
  amountCaption: React.ReactNode;
}

interface IDispatchProps {
  onClick: () => void;
}

interface IStateProps {
  additionalData?: TWithdrawAdditionalData;
  gasCost: string;
  gasCostEur: string;
  walletAddress: string;
  tokenImage: string;
  tokenSymbol: EquityToken;
  tokenDecimals: number;
}

export type TTransferTransactionProps = RequiredByKeys<IStateProps, "additionalData"> &
  ITransferTransactionExternalProps &
  ITransferTransactionInternalProps &
  IDispatchProps;

export const transferTransaction = () =>
  compose<TTransferTransactionProps, ITransferTransactionExternalProps>(
    appConnect<IStateProps, IDispatchProps>({
      stateToProps: state => ({
        additionalData: selectTxAdditionalData<
          ETxSenderType.WITHDRAW | ETxSenderType.TRANSFER_TOKENS
        >(state),
        walletAddress: selectEthereumAddressWithChecksum(state),
        gasCost: selectTxGasCostEthUlps(state),
        gasCostEur: selectTxGasCostEthUlps(state),
        tokenSymbol: selectUserFlowTokenSymbol(state),
        tokenImage: selectUserFlowTokenImage(state),
        tokenDecimals: selectUserFlowTokenDecimals(state),
      }),
      dispatchToProps: d => ({
        onClick: () => d(actions.txSender.txSenderHideModal()),
      }),
    }),
    branch<IStateProps>(
      props => props.additionalData === undefined,
      () => {
        throw new Error("Additional transaction data is empty");
      },
    ),
  );
