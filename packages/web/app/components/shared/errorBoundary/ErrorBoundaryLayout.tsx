import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { withContainer } from "../../../utils/withContainer.unsafe";
import { Layout } from "../../layouts/Layout";

import * as styles from "./ErrorBoundary.module.scss";

export const ErrorBoundaryComponent: React.FunctionComponent<{}> = () => (
  <div className={styles.errorLayout}>
    <FormattedMessage id="error-boundary.main-error-message" />
  </div>
);

export const ErrorBoundaryLayout = compose(withContainer(Layout))(ErrorBoundaryComponent);
