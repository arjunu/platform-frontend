import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";
import { Row } from "reactstrap";

import { recoverRoutes } from "../../wallet-recover/router/recoverRoutes";

import mailLink from "../../../../assets/img/mail_link.svg";
import * as styles from "../WalletLight.module.scss";

export const MissingEmailLightWallet: React.FunctionComponent<{}> = () => (
  <>
    <Row className="justify-content-center mt-5 mb-5">
      <img src={mailLink} className="text-center" />
    </Row>
    <p className={styles.missingEmail} data-test-id="neuwallet-missing-email">
      <FormattedHTMLMessage
        tagName="span"
        id="wallet-selector.neuwallet.login-instructions"
        values={{ url: recoverRoutes.help }}
      />
    </p>
  </>
);
