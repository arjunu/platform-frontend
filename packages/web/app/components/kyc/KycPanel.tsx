import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId } from "../../types";
import { ButtonLink, EButtonLayout, EIconPosition } from "../shared/buttons";
import { Panel } from "../shared/Panel";
import { IVerificationProgressStep, VerificationStatus } from "../shared/VerificationStatus";

import arrowLeft from "../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./KycPanel.module.scss";

interface IPropsKycPanel {
  backLink?: string;
  isMaxWidth?: boolean;
  fullHeightContent?: boolean;
  description?: string | React.ReactNode;
  steps: IVerificationProgressStep[];
  title?: string | React.ReactNode;
}

export const KycPanel: React.FunctionComponent<IPropsKycPanel & TDataTestId> = ({
  title,
  steps,
  children,
  description,
  backLink,
  isMaxWidth,
  fullHeightContent,
  "data-test-id": testId,
}) => (
  <Panel data-test-id={testId} className={cn("mt-4", styles.kycPanel)}>
    <header className={styles.header}>
      <h2 className={styles.title}>{title || <FormattedMessage id="kyc.panel.verification" />}</h2>

      <VerificationStatus steps={steps} />

      {description && (
        <div className={styles.description} data-test-id="kyc-panel-description">
          {description}
        </div>
      )}
    </header>

    {children && (
      <div
        className={cn(
          isMaxWidth ? styles.content : styles.contentNarrow,
          fullHeightContent ? styles.noTopPadding : null,
        )}
      >
        {children}
      </div>
    )}

    {backLink && (
      <footer className={styles.footer}>
        <ButtonLink
          to={backLink}
          layout={EButtonLayout.GHOST}
          iconPosition={EIconPosition.ICON_BEFORE}
          svgIcon={arrowLeft}
        >
          <FormattedMessage id="kyc.panel.go-back" />
        </ButtonLink>
      </footer>
    )}
  </Panel>
);
