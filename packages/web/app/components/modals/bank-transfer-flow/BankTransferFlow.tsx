import { invariant } from "@neufund/shared"
import * as React from "react";

import { actions } from "../../../modules/actions";
import {
  EBankTransferFlowState,
  EBankTransferType,
} from "../../../modules/bank-transfer-flow/reducer";
import {
  selectBankTransferFlowState,
  selectBankTransferType,
  selectIsBankTransferModalOpened,
} from "../../../modules/bank-transfer-flow/selectors";
import { appConnect } from "../../../store";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { BankTransferPurchaseSuccess } from "./purchase/BankTransferPurchaseSuccess";
import { BankTransferPurchaseSummary } from "./purchase/BankTransferPurchaseSummary";
import { QuintessenceModal } from "./QuintessenceModal";
import { BankTransferAgreement } from "./shared/BankTransferAgreement";
import { BankTransferVerifyAgreement } from "./verify/BankTransferVerifyAgreement";
import { BankTransferVerifySuccess } from "./verify/BankTransferVerifySuccess";
import { BankTransferVerifySummary } from "./verify/BankTransferVerifySummary";

interface IStateProps {
  isOpen: boolean;
  state: EBankTransferFlowState;
  type: EBankTransferType | undefined;
}

interface IDispatchProps {
  onCancel: () => void;
}

type Props = IStateProps & IDispatchProps;

const BankTransferFlowModalLayout: React.FunctionComponent<Props> = props => {
  const { isOpen, onCancel } = props;

  return (
    <QuintessenceModal isOpen={isOpen} onClose={onCancel}>
      <BankTransferFlowBody {...props} />
    </QuintessenceModal>
  );
};

const BankTransferFlowAgreement: React.FunctionComponent<Props> = ({ type }) => {
  switch (type) {
    case EBankTransferType.VERIFY:
      return <BankTransferVerifyAgreement />;
    case EBankTransferType.PURCHASE:
      return <BankTransferAgreement />;
    default:
      return invariant(false, `Type "${type}" doesn't implement agreement flow`);
  }
};

const BankTransferFlowSuccess: React.FunctionComponent<Props> = ({ type }) => {
  switch (type) {
    case EBankTransferType.PURCHASE:
      return <BankTransferPurchaseSuccess />;
    case EBankTransferType.VERIFY:
      return <BankTransferVerifySuccess />;
    default:
      return invariant(false, `Type "${type}" doesn't implement success flow`);
  }
};

const BankTransferFlowSummary: React.FunctionComponent<Props> = ({ type }) => {
  switch (type) {
    case EBankTransferType.PURCHASE:
      return <BankTransferPurchaseSummary />;
    case EBankTransferType.VERIFY:
      return <BankTransferVerifySummary />;
    default:
      return invariant(false, `Type "${type}" doesn't implement summary flow`);
  }
};

const BankTransferFlowBody: React.FunctionComponent<Props> = props => {
  switch (props.state) {
    case EBankTransferFlowState.PROCESSING:
      return <LoadingIndicator />;
    case EBankTransferFlowState.AGREEMENT:
      return <BankTransferFlowAgreement {...props} />;
    case EBankTransferFlowState.SUMMARY:
      return <BankTransferFlowSummary {...props} />;
    case EBankTransferFlowState.SUCCESS:
      return <BankTransferFlowSuccess {...props} />;
    default:
      return null;
  }
};

const BankTransferFlowModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: selectIsBankTransferModalOpened(state),
    state: selectBankTransferFlowState(state),
    type: selectBankTransferType(state),
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.bankTransferFlow.stopBankTransfer()),
  }),
})(BankTransferFlowModalLayout);

export { BankTransferFlowModal, BankTransferFlowModalLayout };
