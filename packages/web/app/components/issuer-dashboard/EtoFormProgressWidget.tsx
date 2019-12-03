import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId } from "../../types";
import { EColumnSpan } from "../layouts/Container";
import { ButtonLink, EButtonLayout, EIconPosition } from "../shared/buttons/index";
import { ChartCircle, IChartCircleProps } from "../shared/charts/ChartCircle";
import { LoadingIndicator } from "../shared/loading-indicator/index";
import { Panel } from "../shared/Panel";
import { Proportion } from "../shared/Proportion";

import * as arrowRightIcon from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./EtoFormProgressWidget.module.scss";

interface IProps {
  to: string;
  isLoading: boolean;
  disabled: boolean;
  readonly: boolean;
}

interface IButtonTextProps {
  isInProgress: boolean;
  readonly: boolean;
}

const ButtonText: React.FunctionComponent<IButtonTextProps> = ({ isInProgress, readonly }) => {
  if (readonly) {
    return <FormattedMessage id="shared-component.eto-form-progress-widget.show" />;
  }

  if (isInProgress) {
    return <FormattedMessage id="shared-component.eto-form-progress-widget.complete" />;
  }

  return <FormattedMessage id="shared-component.eto-form-progress-widget.edit" />;
};

export const EtoFormProgressWidget: React.FunctionComponent<IProps &
  IChartCircleProps &
  TDataTestId> = ({
  to,
  progress,
  name,
  isLoading,
  disabled,
  readonly,
  "data-test-id": dataTestId,
}) => (
  <Panel columnSpan={EColumnSpan.ONE_COL} className={styles.progressSection}>
    <Proportion width={100} height={108}>
      <div className={styles.contentWrapper} data-test-id={dataTestId}>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
          <>
            <ChartCircle progress={progress} name={name} />

            <div className={styles.linkWrapper}>
              <ButtonLink
                to={{
                  pathname: to,
                }}
                layout={EButtonLayout.GHOST}
                iconPosition={EIconPosition.ICON_AFTER}
                svgIcon={arrowRightIcon}
                disabled={disabled}
              >
                <ButtonText isInProgress={progress < 1} readonly={readonly} />
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </Proportion>
  </Panel>
);
