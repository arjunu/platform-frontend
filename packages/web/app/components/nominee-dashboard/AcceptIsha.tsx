import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { Button, EButtonLayout, EButtonTheme } from "../shared/buttons/Button";

interface IDispatchProps {
  sign: () => void;
}

export const AcceptISHALayout: React.FunctionComponent<IDispatchProps> = ({ sign }) => (
  <section data-test-id="nominee-flow-sign-isha">
    <h4>
      <FormattedMessage id="nominee.upload-isha.title" />
    </h4>
    <p>
      <FormattedMessage id="nominee.upload-isha.text" />
    </p>
    <Button
      layout={EButtonLayout.PRIMARY}
      theme={EButtonTheme.BRAND}
      data-test-id="eto-nominee-sign-isha-action"
      onClick={sign}
    >
      <FormattedMessage id="nominee-flow.sign-agreement.sign-button" />
    </Button>
  </section>
);

const AcceptISHA = compose<IDispatchProps, {}>(
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      sign: () => dispatch(actions.txTransactions.startNomineeISHASign()),
    }),
  }),
)(AcceptISHALayout);

export { AcceptISHA };
