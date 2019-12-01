import * as React from "react";

import { TDataTestId } from "../../../../../types";
import { Container, EColumnSpan } from "../../../../layouts/Container";

import * as infoIcon from "../../../../../assets/img/notifications/info.svg";
import * as styles from "./CoverBanner.module.scss";

export const CoverBannerBase: React.FunctionComponent<TDataTestId> = ({
  children,
  "data-test-id": dataTestId,
}) => (
  <Container
    columnSpan={EColumnSpan.THREE_COL}
    className={styles.jurisdictionBanner}
    data-test-id={dataTestId}
  >
    <img src={infoIcon} className={styles.icon} alt="" />
    {children}
  </Container>
);
