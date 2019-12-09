import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { WarningAlert } from "../../shared/WarningAlert";
import { LedgerHeader } from "./LedgerHeader";

import * as arrowIcon from "../../../assets/img/inline_icons/link_arrow.svg";
import * as logoChrome from "../../../assets/img/wallet_selector/logo_chrome.svg";
import * as styles from "./WalletLedgerNotSupportedComponent.module.scss";

interface IBrowserCard {
  name: string;
  img: string;
  url: string;
}

const BrowserCard: React.FunctionComponent<IBrowserCard> = ({ name, img, url }) => (
  <Col xs="12" sm="4" className={cn("mb-4 mb-md-0 px-4")}>
    <h4 className={styles.browserCardTitle}>{name}</h4>
    <img className={cn("my-2 my-md-4", styles.browserCardImg)} src={img} />
    <a href={url} className={styles.browserCardLink}>
      Download <img src={arrowIcon} />
    </a>
  </Col>
);

export const WalletLedgerNotSupported: React.FunctionComponent = () => (
  <>
    <Row>
      <Col>
        <LedgerHeader />
      </Col>
    </Row>
    <Row className="justify-content-center">
      <WarningAlert className="my-5">
        <FormattedMessage id="wallet-selector.ledger-not-supported" />
      </WarningAlert>
    </Row>
    <Row className="justify-content-center text-center">
      <BrowserCard name="Chrome" img={logoChrome} url="https://www.google.pl/chrome/" />
    </Row>
  </>
);
