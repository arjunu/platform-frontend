import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { selectEthereumAddressWithChecksum } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { EColumnSpan } from "../../layouts/Container";
import { AccountAddressWithHistoryLink } from "../../shared/AccountAddress";
import { Panel } from "../../shared/Panel";

import * as styles from "./YourEthereumAddressWidget.module.scss";

interface IStateProps {
  address: string;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

export const YourEthereumAddressWidgetComponent: React.FunctionComponent<IStateProps &
  IExternalProps> = ({ address, columnSpan }) => (
  <Panel
    columnSpan={columnSpan}
    headerText={<FormattedMessage id="your-ethereum-address-widget.header" />}
  >
    <p>
      <FormattedMessage id="your-ethereum-address-widget.explanation" />
    </p>
    <div className={styles.panelBody}>
      <AccountAddressWithHistoryLink address={address} />
    </div>
  </Panel>
);

export const YourEthereumAddressWidget = appConnect<IStateProps>({
  stateToProps: state => ({
    address: selectEthereumAddressWithChecksum(state),
  }),
})(YourEthereumAddressWidgetComponent);
