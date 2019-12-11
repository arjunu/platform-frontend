import { nonNullable } from "@neufund/shared"
import * as React from "react";
import { FormattedRelative } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import {
  selectClaimStateDeadlineTimestamp,
  selectNomineeActiveEtoCompanyName,
} from "../../modules/nominee-flow/selectors";
import { appConnect } from "../../store";
import { Button, EButtonLayout } from "../shared/buttons/Button";

import * as styles from "./NomineeDashboard.module.scss";

type TDispatchProps = {
  sign: () => void;
};

type TStateProps = {
  deadlineTimestamp: number;
  companyName: string;
};

export const AcceptISHALayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  sign,
  deadlineTimestamp,
  companyName,
}) => (
  <section data-test-id="nominee-flow-sign-isha">
    <h4>
      <FormattedMessage id="nominee.upload-isha.title" />
    </h4>
    <p>
      <FormattedMessage id="nominee.upload-isha.text" values={{ companyName }} />
    </p>
    <p className={styles.textBold}>
      <FormattedMessage id="nominee-flow.redeem-share-capital.text-note" />
      <FormattedRelative value={deadlineTimestamp} initialNow={new Date()} style={"numeric"} />
    </p>
    <Button layout={EButtonLayout.PRIMARY} data-test-id="nominee-sign-isha-button" onClick={sign}>
      <FormattedMessage id="nominee-flow.sign-agreement.sign-button" />
    </Button>
  </section>
);

const AcceptISHA = compose<TStateProps & TDispatchProps, {}>(
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      companyName: nonNullable(selectNomineeActiveEtoCompanyName(state)),
      deadlineTimestamp: nonNullable(selectClaimStateDeadlineTimestamp(state)),
    }),
    dispatchToProps: dispatch => ({
      sign: () => dispatch(actions.txTransactions.startNomineeISHASign()),
    }),
  }),
)(AcceptISHALayout);

export { AcceptISHA };
