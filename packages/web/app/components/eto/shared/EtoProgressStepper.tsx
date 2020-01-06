import * as cn from "classnames";
import { range } from "lodash";
import * as React from "react";

import { InlineIcon } from "../../shared/icons";

import checkIcon from "../../../assets/img/inline_icons/check.svg";
import * as styles from "./EtoProgressStepper.module.scss";

export interface IStepProps {
  name: string;
  isDone: boolean;
}

export interface IEtoProgressStepper {
  currentStep: number;
  stepProps: IStepProps[];
  onClick: (step: number) => void;
}

export const EtoProgressStepper: React.FunctionComponent<IEtoProgressStepper> = ({
  currentStep,
  stepProps,
  onClick,
}) => (
  <div className={styles.progressStepper}>
    {range(stepProps.length).map(number => (
      <button
        className={styles.progressStep}
        key={number}
        onClick={() => onClick(number)}
        data-test-id="EtoProgressStepper-step-button"
      >
        <span data-test-id="EtoProgressStepper-header-text">
          {stepProps[number].isDone ? (
            <InlineIcon
              svgIcon={checkIcon}
              height="11px"
              width="15px"
              className=""
              data-test-id="check-icon"
            />
          ) : (
            `${number + 1}. ${stepProps[number].name}`
          )}
        </span>
        <span className={cn(styles.stepBlock, number + 1 === currentStep && styles.active)} />
      </button>
    ))}
  </div>
);
