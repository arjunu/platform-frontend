import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { Button, EButtonLayout, EIconPosition } from "../../shared/buttons/Button";
import { LogoUnauth } from "./Header";

import * as close from "../../../assets/img/inline_icons/close.svg";
import * as styles from "./Header.module.scss";

export type THeaderFullscreenProps = {
  action?: () => void;
  title?: string;
};

/* TODO: replace with proper button when buttons PR is merged
   https://github.com/Neufund/platform-frontend/pull/3759
*/
const ActionButton: React.FunctionComponent<THeaderFullscreenProps & CommonHtmlProps> = ({
  action,
  title,
  className,
}) => (
  <Button
    layout={EButtonLayout.PRIMARY}
    className={className}
    svgIcon={close}
    iconPosition={EIconPosition.ICON_AFTER}
    onClick={action}
  >
    {title}
  </Button>
);

const HeaderFullscreen: React.FunctionComponent<THeaderFullscreenProps> = ({ action, title }) => (
  <div className={styles.headerUnauth}>
    <LogoUnauth />
    {action && <ActionButton className={styles.button} action={action} title={title} />}
  </div>
);

export { HeaderFullscreen };
