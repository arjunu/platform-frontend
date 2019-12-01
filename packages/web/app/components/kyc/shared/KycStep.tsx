import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../../types";
import {
  calculateStepProgress,
  FullscreenProgressContext,
} from "../../layouts/FullscreenProgressLayout";

import * as styles from "./KycStep.module.scss";

type TProps = {
  step: number;
  allSteps: number;
  title: TTranslatedString;
  description: TTranslatedString;
};

const KycStep: React.FunctionComponent<TProps> = ({ step, allSteps, title, description }) => {
  const { setCurrentProgress } = React.useContext(FullscreenProgressContext);

  React.useMemo(() => {
    setCurrentProgress(calculateStepProgress(step, allSteps));
  }, [setCurrentProgress]);

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
