import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import { selectEthereumAddressWithChecksum } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { AccountAddressWithHistoryLink } from "../../shared/AccountAddress";
import { EthereumQRCode } from "../../shared/EthereumQRCode";
import { Modal } from "../Modal";

import * as styles from "./DepositEthModal.module.scss";

interface IStateProps {
  isOpen: boolean;
  address: string;
}

interface IDispatchProps {
  onCancel: () => void;
}

const DepositEthModalComponent: React.FunctionComponent<IStateProps & IDispatchProps> = props => (
  <Modal isOpen={props.isOpen} onClose={props.onCancel}>
    <div className={styles.contentWrapper}>
      <div className={styles.qrCodeWrapper}>
        <EthereumQRCode
          address={props.address}
          value={0}
          gas={0}
          data-test-id="wallet-balance.ether.deposit.qr-code"
        />
      </div>
      <h2 className={styles.title}>
        <FormattedMessage id="modal.deposit-eth.title" />
      </h2>
      <p className={styles.description}>
        <FormattedMessage id="modal.deposit-eth.description" />
      </p>
      <AccountAddressWithHistoryLink
        address={props.address}
        className={styles.address}
        data-test-id="wallet-balance.ether.deposit.address"
      />
    </div>
  </Modal>
);

export const DepositEthModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: state.depositEthModal.isOpen,
    address: selectEthereumAddressWithChecksum(state),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.depositEthModal.hideDepositEthModal()),
  }),
})(DepositEthModalComponent);
