import * as React from "react";

import { formatDate } from "../../utils/DateUtils";

import * as styles from "./Date.module.scss";

interface IProps {
  timestamp: number;
}

export const Date: React.FunctionComponent<IProps> = ({ timestamp }) => (
  <time className={styles.date}>{formatDate(timestamp)}</time>
);
