import { withContainer } from "@neufund/shared";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import { ELogoutReason } from "../../../../modules/auth/types";
import { appConnect } from "../../../../store";
import { Button } from "../../../shared/buttons";
import { HeaderProgressStepper } from "../../../shared/HeaderProgressStepper";
import { WalletSelectorContainer } from "../../WalletSelectorContainer";
import { recoverRoutes } from "../router/recoverRoutes";

import * as styles from "./RecoverySuccess.module.scss";

interface IDispatchProps {
  goToDashboard: () => void;
}
export const RecoverySuccessComponent: React.FunctionComponent<IDispatchProps> = ({
  goToDashboard,
}) => (
  <div>
    <Col className="mt-4 pb-5">
      <HeaderProgressStepper
        headerText={
          <FormattedHTMLMessage
            tagName="span"
            id="components.wallet-selector.wallet-recover.recovery-success.save-access-link"
          />
        }
        steps={8}
        currentStep={8}
        headerClassName={styles.header}
      />
    </Col>
    <Col className="mt-4 mb-5 mx-auto">
      <h5 className="text-center">
        <i className="fa fa-check-circle mr-1" />
        <FormattedMessage id="components.wallet-selector.wallet-recover.recovery-success.you-have-new-password" />
      </h5>
    </Col>
    <Row className="justify-content-center mb-5 mt-5 pt-4">
      <Col xs={6} sm={5} md={4} lg={3}>
        <Button onClick={goToDashboard} data-test-id="recovery-success-btn-go-to-login">
          <FormattedMessage id="components.wallet-selector.wallet-recover.recovery-success.go-to-login" />
        </Button>
      </Col>
    </Row>
    <Row className="justify-content-end mt-4 pt-4 align-bottom" noGutters>
      <Col className="align-bottom text-end">
        <Link to={recoverRoutes.help}>
          <FormattedMessage id="components.wallet-selector.wallet-recover.recovery-success.contact-for-help" />
          <i className="fa fa-lg fa-angle-right ml-1" />
        </Link>
      </Col>
    </Row>
  </div>
);

export const RecoverySuccess = compose<React.FunctionComponent>(
  appConnect<void, IDispatchProps>({
    dispatchToProps: dispatch => ({
      goToDashboard: () =>
        dispatch(actions.routing.goToLogin({ logoutReason: ELogoutReason.USER_REQUESTED })),
    }),
  }),
  withContainer(WalletSelectorContainer),
)(RecoverySuccessComponent);
