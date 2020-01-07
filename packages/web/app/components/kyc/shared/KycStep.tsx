import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { TDataTestId, TTranslatedString } from "../../../types";
import { withHeaderButton } from "../../../utils/withHeaderButton";
import { withProgress } from "../../../utils/withProgress";

import * as styles from "./KycStep.module.scss";

type TProps = {
  step: number;
  allSteps: number;
  title: TTranslatedString;
  description: TTranslatedString;
  buttonAction: () => void;
};

const KycStepComponent: React.FunctionComponent<TProps & TDataTestId> = ({
  step,
  allSteps,
  title,
  description,
  ["data-test-id"]: dataTestId,
}) => (
  <>
    <span className={styles.step} data-test-id={dataTestId}>
      <FormattedMessage id="shared.kyc.step" values={{ step, allSteps }} />
    </span>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
  </>
);

const KycStep = compose<TProps, TProps>(
  withProgress<TProps>((props: TProps) => ({ step: props.step, allSteps: props.allSteps })),
  withHeaderButton<TProps>((props: TProps) => ({
    buttonText: <FormattedMessage id="form.save-and-close" />,
    buttonAction: props.buttonAction,
  })),
)(KycStepComponent);

export { KycStep };
