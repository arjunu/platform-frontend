import { debounce } from "lodash";
import * as React from "react";
import { Col, FormFeedback, FormGroup, Input, Row } from "reactstrap";

import { DEFAULT_DERIVATION_PATH_PREFIX } from "../../../modules/wallet-selector/ledger-wizard/reducer";
import { IIntlProps, injectIntlHelpers } from "@neufund/shared"
import { derivationPathPrefixValidator } from "../../../utils/Validators";

const DEBOUNCE_DELAY = 200;

interface IDPChooserComponent {
  derivationPathPrefix: string;
  onDerivationPathPrefixChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string | null;
}

export const DPChooserComponent: React.FunctionComponent<IDPChooserComponent & IIntlProps> = ({
  derivationPathPrefix,
  onDerivationPathPrefixChange,
  errorMessage,
  intl: { formatIntlMessage },
}) => (
  <Row>
    <Col>
      <FormGroup>
        <Input
          name="derivationPathPrefix"
          value={derivationPathPrefix}
          onChange={onDerivationPathPrefixChange}
          placeholder={formatIntlMessage(
            "wallet-selector.ledger.derivation-path-selector.placeholder",
          )}
          invalid={errorMessage !== null}
          className="col-md-5"
        />
        <FormFeedback data-test-id="dpChooser-error-msg">{errorMessage}</FormFeedback>
      </FormGroup>
    </Col>
  </Row>
);

export const DPChooserComponentWithIntl = injectIntlHelpers<IDPChooserComponent>(
  DPChooserComponent,
);

interface IDPChooserProps {
  onDerivationPathPrefixChange: (derivationPathPrefix: string) => void;
  onDerivationPathPrefixError: () => void;
}

interface IDPChooserState {
  derivationPathPrefix: string;
  errorMessage: string | null;
}

export class WalletLedgerDPChooser extends React.Component<IDPChooserProps, IDPChooserState> {
  constructor(props: IDPChooserProps) {
    super(props);
    this.state = {
      derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
      errorMessage: null,
    };
  }

  debouncedOnChange = debounce((derivationPathPrefix: string): void => {
    const fixedDp = derivationPathPrefix.endsWith("/")
      ? derivationPathPrefix
      : derivationPathPrefix + "/";
    const errorMessage = derivationPathPrefixValidator(fixedDp);
    this.setState({
      errorMessage,
    });
    if (errorMessage) {
      this.props.onDerivationPathPrefixError();
    } else {
      this.props.onDerivationPathPrefixChange(fixedDp);
    }
  }, DEBOUNCE_DELAY);

  onDerivationPathPrefixChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const derivationPathPrefix = event.target.value;
    this.setState({
      derivationPathPrefix,
    });
    this.debouncedOnChange(derivationPathPrefix);
  };

  render(): React.ReactNode {
    return (
      <DPChooserComponentWithIntl
        onDerivationPathPrefixChange={this.onDerivationPathPrefixChange}
        derivationPathPrefix={this.state.derivationPathPrefix}
        errorMessage={this.state.errorMessage}
      />
    );
  }
}
