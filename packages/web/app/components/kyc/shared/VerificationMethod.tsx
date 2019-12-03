import * as React from "react";

import { TTranslatedString } from "../../../types";
import { ButtonBase } from "../../shared/buttons/ButtonBase";
import { InlineIcon } from "../../shared/icons/InlineIcon";

import * as arrow from "../../../assets/img/inline_icons/link_arrow.svg";
import * as styles from "./VerificationMethod.module.scss";

type TProps = {
  onClick?: () => void;
  logo: string;
  text: TTranslatedString;
  name: string;
  disabled?: boolean;
};

export const VerificationMethod: React.FunctionComponent<TProps> = ({
  logo,
  name,
  onClick,
  text,
  disabled,
}) => (
  <ButtonBase className={styles.card} onClick={onClick} disabled={disabled}>
    <img className={styles.image} src={logo} alt={name} />
    <span className="py-2">{text}</span>
    <InlineIcon className={styles.icon} svgIcon={arrow} />
  </ButtonBase>
);
