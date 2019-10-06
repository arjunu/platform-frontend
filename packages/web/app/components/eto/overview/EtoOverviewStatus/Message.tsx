import * as React from "react";

import { OmitKeys, TDataTestId, TTranslatedString } from "../../../../types";
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
  "data-test-id": dataTestId,
}) => (
  <section className={styles.widget} data-test-id={dataTestId}>
    {tick}
    <header className={styles.message}>
      {title && <h5>{title}</h5>}
      {summary && <p>{summary}</p>}
    </header>
  </section>
);

const SuccessMessage: React.FunctionComponent<
  OmitKeys<IExternalProps, "tick"> & TDataTestId
> = props => <Message {...props} tick={<SuccessTick />} />;

export { Message, SuccessMessage };
