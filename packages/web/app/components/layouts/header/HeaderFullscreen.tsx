import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../../types";
import { Button, EButtonLayout, EIconPosition } from "../../shared/buttons/Button";
import { LogoUnauth } from "./Header";

import * as close from "../../../assets/img/inline_icons/close.svg";
import * as styles from "./Header.module.scss";

export type THeaderFullscreenProps = {
  buttonAction?: () => void;
  buttonText?: TTranslatedString;
};

const ActionButton: React.FunctionComponent<THeaderFullscreenProps & CommonHtmlProps> = ({
  buttonAction,
  buttonText,
  className,
}) => (
  <Button
    layout={EButtonLayout.GHOST}
    className={className}
    svgIcon={close}
    iconPosition={EIconPosition.ICON_AFTER}
    onClick={buttonAction}
  >
    {buttonText}
  </Button>
);

const HeaderFullscreen: React.FunctionComponent<THeaderFullscreenProps> = ({
  buttonAction,
  buttonText,
}) => (
  <header className={styles.headerUnauth}>
    <LogoUnauth />
    {buttonAction && (
      <ActionButton className={styles.button} buttonAction={buttonAction} buttonText={buttonText} />
    )}
  </header>
);

export { HeaderFullscreen };
