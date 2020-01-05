import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { selectEthereumAddressWithChecksum } from "../../../../modules/web3/selectors";
import { appConnect } from "../../../../store";
import { DepositFunds } from "./DepositFunds";

import icon from "../../../../assets/img/eth_icon.svg";
import * as styles from "./DepositEth.module.scss";

interface IProps {
  path: string;
}

interface IStateProps {
  ethAddress: string;
}

export const DepositEthComponent: React.FunctionComponent<IProps & IStateProps> = ({
  path,
  ethAddress,
}) => (
  <DepositFunds path={path}>
    <div className={styles.methodEth}>
      <h2 className={styles.title}>
        <FormattedMessage
          id="wallet.deposit-funds.eth.header"
          values={{ icon: <img src={icon} className={styles.icon} alt="ETH icon" /> }}
        />
      </h2>
      <p className={styles.description}>
        <FormattedMessage id="wallet.deposit-funds.eth.email-notification" />
      </p>
      <div className={styles.background}>
        <div className={styles.details}>
          <div className={styles.label}>
            <FormattedMessage id="wallet.deposit-funds.eth.your-eth-address" />
          </div>
          <div className={styles.ethAddress}>{ethAddress}</div>
        </div>
      </div>
    </div>
  </DepositFunds>
);

export const DepositEth = compose(
  appConnect<IStateProps>({
    stateToProps: state => ({
      ethAddress: selectEthereumAddressWithChecksum(state),
    }),
  }),
)(DepositEthComponent);
