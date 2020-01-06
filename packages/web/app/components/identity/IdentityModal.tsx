import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { ResponsiveImage } from "../shared/ResponsiveImage";

import ipfsImage from "../../assets/img/ipfs.png";
import * as styles from "./IdentityModal.module.scss";

const IdentityModal: React.FunctionComponent = () => (
  <>
    <Row className="mb-5 justify-content-center">
      <Col xs={11} className="d-flex justify-content-center">
        <ResponsiveImage
          srcSet={{ "1x": ipfsImage }}
          alt=""
          theme="light"
          width={375}
          height={208}
        />
      </Col>
    </Row>
    <Row className="mb-3 justify-content-center">
      <Col xs={11} className={styles.content}>
        <FormattedHTMLMessage tagName="span" id="identity.modal.description" />
      </Col>
    </Row>
  </>
);

export { IdentityModal };
