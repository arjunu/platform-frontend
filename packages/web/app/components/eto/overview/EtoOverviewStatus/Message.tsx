import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../../../types";
import { SuccessTick } from "../../../shared/SuccessTick";

import * as styles from "./Message.module.scss";

interface IExternalProps {
  tick?: React.ReactElement;
  title?: TTranslatedString;
  summary?: TTranslatedString;
}

const Message: React.FunctionComponent<IExternalProps & TDataTestId> = ({
  tick,
  title,
  summary,
  children,
  "data-test-id": dataTestId,
}) => (
  <section className={styles.widget} data-test-id={dataTestId}>
    {tick}
    {title && <h5 className={styles.title}>{title}</h5>}
    {summary && <p className="mb-0">{summary}</p>}
    {children}
  </section>
);

const SuccessMessage: React.FunctionComponent<Omit<IExternalProps, "tick"> &
  TDataTestId> = props => <Message {...props} tick={<SuccessTick />} />;

export { Message, SuccessMessage };
