import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import {
  calculateStepProgress,
  FullscreenProgressContext,
} from "../layouts/FullscreenProgressLayout";
import { Button, EButtonLayout } from "../shared/buttons/Button";
import { SuccessTick } from "../shared/SuccessTick";

import * as styles from "./Success.module.scss";

type TDispatchProps = {
  goToDashboard: () => void;
  goToAddAdditional: () => void;
};

const KycSuccessLayout: React.FunctionComponent<TDispatchProps> = ({
  goToDashboard,
  goToAddAdditional,
}) => {
  const { setCurrentProgress } = React.useContext(FullscreenProgressContext);

  React.useMemo(() => {
    setCurrentProgress(calculateStepProgress(5, 5));
  }, [setCurrentProgress]);

  return (
    <>
      <SuccessTick />
      <h2 className={styles.title}>
        <FormattedMessage id="kyc.success.title" />
      </h2>
      <p className={styles.text}>
        <FormattedMessage id="kyc.success.text" />
      </p>

      <div className={styles.buttons}>
        <Button
          layout={EButtonLayout.PRIMARY}
          className={styles.button}
          data-test-id="kyc-success-go-to-dashboard"
          onClick={goToDashboard}
        >
          <FormattedMessage id="kyc.success.go-to-dashboard" />
        </Button>
        <Button
          layout={EButtonLayout.GHOST}
          className={styles.button}
          type="button"
          data-test-id="kyc-success-go-to-additional-documents"
          onClick={goToAddAdditional}
        >
          <FormattedMessage id="kyc.success.go-to-additional-documents" />
        </Button>
      </div>
    </>
  );
};

const KycSuccess = compose<TDispatchProps, {}>(
  appConnect<{}, TDispatchProps, {}>({
    dispatchToProps: dispatch => ({
      goToAddAdditional: () => dispatch(actions.routing.goToKYCIndividualUpload()),
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
    }),
  }),
)(KycSuccessLayout);

export { KycSuccessLayout, KycSuccess };
