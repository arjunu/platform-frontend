import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../types";
import {
  calculateStepProgress,
  FullscreenButtonContext,
  FullscreenProgressContext,
} from "../../layouts/FullscreenProgressLayout";

import * as styles from "./KycStep.module.scss";

type TProps = {
  step: number;
  allSteps: number;
  title: TTranslatedString;
  description: TTranslatedString;
  buttonAction?: () => void;
};

const KycStep: React.FunctionComponent<TProps> = ({
  step,
  allSteps,
  title,
  description,
  buttonAction,
}) => {
  const { setCurrentProgress } = React.useContext(FullscreenProgressContext);

  React.useMemo(() => {
    setCurrentProgress(calculateStepProgress(step, allSteps));
  }, [setCurrentProgress]);

  const { setCurrentButtonProps } = React.useContext(FullscreenButtonContext);

  React.useMemo(() => {
    setCurrentButtonProps(<FormattedMessage id="form.save-and-close" />, buttonAction);
  }, [setCurrentButtonProps, buttonAction]);

  return (
    <>
      <span className={styles.step}>
        <FormattedMessage id="shared.kyc.step" values={{ step, allSteps }} />
      </span>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </>
  );
};

export { KycStep };
