import { withContainer } from "@neufund/shared";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose, withProps } from "recompose";

import { externalRoutes } from "../../../../config/externalRoutes";
import { TDataTestId } from "../../../../types";
import { ButtonLink } from "../../../shared/buttons";
import { ExternalLink } from "../../../shared/links";
import { walletLoginRoutes } from "../../walletRoutes";
import { WalletSelectorContainer } from "../../WalletSelectorContainer";
import { recoverRoutes } from "../router/recoverRoutes";

export const LoginHelpLayout: React.FunctionComponent<{}> = () => (
  <>
    <Col className="mt-5 mb-5">
      <h2 className="font-weight-bold mx-auto text-center">
        <FormattedMessage id="wallet-selector.recover.help.prompt" />
      </h2>
    </Col>
    <Col md={10} className="mb-5 mt-5 offset-md-1 ">
      <p>
        <FormattedMessage id="wallet-selector.recover.help.email-login" />
      </p>
      <div className="border-bottom pb-4" />
    </Col>
    <Col md={10} className="mb-5 mt-5 offset-md-1">
      <Row className="justify-content-between" noGutters>
        <div>
          <h5 className="font-weight-bold">
            <FormattedMessage id="wallet-selector.recover.help.password-forgotten" />
          </h5>
          <p>
            <FormattedMessage id="wallet-selector.recover.help.recover-with-passphrase" />
          </p>
        </div>
        <Col xs={12} md={4}>
          <ButtonLink to={recoverRoutes.seed}>
            <FormattedMessage id="wallet-selector.recover.help.recover-button" />
          </ButtonLink>
        </Col>
      </Row>
      <div className="border-bottom pb-4" />
    </Col>
    <Col md={10} className="mt-5 mb-5 offset-md-1">
      <Row className="justify-content-between" noGutters>
        <h5 className="font-weight-bold">
          <FormattedMessage id="wallet-selector.recover.help.ledger-lost" />
        </h5>
        <Col xs={12} md={4}>
          <ButtonLink
            to="https://support.ledgerwallet.com/hc/en-us/articles/360000609933-Lost-device-PIN-code-or-recovery-phrase"
            target="_blank"
          >
            <FormattedMessage id="wallet-selector.recover.help.ledger-lost-btn" />
          </ButtonLink>
        </Col>
      </Row>
    </Col>
    <Col md={12}>
      <Row className="ml-2 mt-5 pt-5 mr-2 justify-content-between align-items-center">
        <Link to={walletLoginRoutes.light}>
          <i className="fa fa-lg fa-angle-left mr-1" />
          <FormattedMessage id="wallet-selector.recover.help.back" />
        </Link>
        <ExternalLink href={externalRoutes.neufundSupportHome}>
          <FormattedMessage id="wallet-selector.recover.help.contact-for-help" />
          <i className="fa fa-lg fa-angle-right ml-1" />
        </ExternalLink>
      </Row>
    </Col>
  </>
);

export const LoginHelp = compose(
  withContainer(
    withProps<TDataTestId, {}>({ "data-test-id": "recover-layout" })(WalletSelectorContainer),
  ),
)(LoginHelpLayout);
