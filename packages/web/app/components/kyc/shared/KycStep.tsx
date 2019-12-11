import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { TTranslatedString } from "../../../types";
import { withHeaderButton } from "../../../utils/react-connected-components/withHeaderButton";
import { withProgress } from "../../../utils/react-connected-components/withProgress";

import * as styles from "./KycStep.module.scss";

type TProps = {
  step: number;
  allSteps: number;
  title: TTranslatedString;
  description: TTranslatedString;
  buttonAction: () => void;
};

const KycStepComponent: React.FunctionComponent<TProps> = ({
  step,
  allSteps,
  title,
  description,
}) => (
  <>
    <span className={styles.step}>
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
