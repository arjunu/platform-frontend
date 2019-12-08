import * as React from "react";

import { ENotificationType } from "../../../modules/notifications/types";
import { TDataTestId, TTranslatedString } from "../../../types";
import { Button, EButtonLayout } from "../../shared/buttons/Button";
import { InlineIcon } from "../../shared/icons/InlineIcon";
import { Notification } from "../../shared/notification-widget/Notification";

import * as arrow from "../../../assets/img/inline_icons/link_arrow.svg";
import * as styles from "./VerificationMethod.module.scss";

type TProps = {
  onClick?: () => void;
  logo: string;
  text: TTranslatedString;
  name: string;
  disabled?: boolean;
  errorText: TTranslatedString | undefined;
  infoText: TTranslatedString | undefined;
};

export const VerificationMethod: React.FunctionComponent<TProps & TDataTestId> = ({
  logo,
  name,
  onClick,
  text,
  disabled,
  errorText,
  infoText,
  "data-test-id": dataTestId,
}) => (
  <>
    {errorText && (
      <Notification text={errorText} className="mt-0 mb-4" type={ENotificationType.WARNING} />
    )}

    {infoText && (
      <Notification text={infoText} className="mt-0 mb-4" type={ENotificationType.INFO} />
    )}

    <Button
      layout={EButtonLayout.OUTLINE}
      className={styles.card}
      onClick={onClick}
      disabled={disabled}
      data-test-id={dataTestId}
    >
      <img height="94" width="94" className={styles.image} src={logo} alt={name} />
      <span className="py-2">{text}</span>
      <InlineIcon width="24" height="24" className={styles.icon} svgIcon={arrow} />
    </Button>
  </>
);
