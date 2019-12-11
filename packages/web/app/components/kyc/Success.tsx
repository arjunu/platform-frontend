import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { withHeaderButton } from "../../utils/react-connected-components/withHeaderButton";
import { withProgress } from "../../utils/react-connected-components/withProgress";
import { Button, EButtonLayout, EButtonSize } from "../shared/buttons/Button";
import { ButtonGroup } from "../shared/buttons/ButtonGroup";
import { SuccessTick } from "../shared/SuccessTick";

import * as styles from "./Success.module.scss";

type TDispatchProps = {
  goToDashboard: () => void;
  goToAddAdditional: () => void;
};

const KycSuccessLayout: React.FunctionComponent<TDispatchProps> = ({
  goToDashboard,
  goToAddAdditional,
}) => (
  <>
    <SuccessTick />
    <h1 className={styles.title} data-test-id="kyc-success">
      <FormattedMessage id="kyc.success.title" />
    </h1>
    <p className={styles.text}>
      <FormattedMessage id="kyc.success.text" />
    </p>

    <ButtonGroup className={styles.buttons} data-test-id="kyc-success">
      <Button
        layout={EButtonLayout.PRIMARY}
        size={EButtonSize.HUGE}
        className={styles.button}
        data-test-id="kyc-success-go-to-dashboard"
        onClick={goToDashboard}
      >
        <FormattedMessage id="kyc.success.go-to-dashboard" />
      </Button>
      <Button
        layout={EButtonLayout.GHOST}
        size={EButtonSize.HUGE}
        className={styles.button}
        data-test-id="kyc-success-go-to-additional-documents"
        onClick={goToAddAdditional}
      >
        <FormattedMessage id="kyc.success.go-to-additional-documents" />
      </Button>
    </ButtonGroup>
  </>
);

const KycSuccess = compose<TDispatchProps, {}>(
  appConnect<{}, TDispatchProps, {}>({
    dispatchToProps: dispatch => ({
      goToAddAdditional: () => dispatch(actions.routing.goToKYCIndividualUpload()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
  withProgress(() => ({ step: 5, allSteps: 5 })),
  withHeaderButton(() => ({
    buttonText: undefined,
    buttonAction: undefined,
  })),
)(KycSuccessLayout);

export { KycSuccessLayout, KycSuccess };
