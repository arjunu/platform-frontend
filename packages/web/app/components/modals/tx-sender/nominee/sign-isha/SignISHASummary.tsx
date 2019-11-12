import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { actions } from "../../../../../modules/actions";
import { appConnect } from "../../../../../store";
import { Button, EButtonLayout, EButtonTheme } from "../../../../shared/buttons/Button";
import { EHeadingSize, Heading } from "../../../../shared/Heading";

interface IDispatchProps {
  onAccept: () => void;
}

const SignNomineeISHASummaryLayout: React.FunctionComponent<IDispatchProps> = ({ onAccept }) => (
  <section className="text-center" data-test-id="nominee-sign-isha-modal">
    <Heading decorator={false} level={2} size={EHeadingSize.HUGE} className="mb-4">
      <FormattedMessage id="nominee.sign-tha.title" />
    </Heading>

    <Button
      onClick={onAccept}
      layout={EButtonLayout.PRIMARY}
      data-test-id="nominee-sign-agreement-sign"
      theme={EButtonTheme.NEON}
    >
      <FormattedMessage id="nominee.sign-agreement.sign" />
    </Button>
  </section>
);

const SignNomineeISHASummary = compose<IDispatchProps, {}>(
  appConnect<{}, IDispatchProps>({
    dispatchToProps: dispatch => ({
      onAccept: () => dispatch(actions.txSender.txSenderAccept()),
    }),
  }),
)(SignNomineeISHASummaryLayout);

export { SignNomineeISHASummaryLayout, SignNomineeISHASummary };
