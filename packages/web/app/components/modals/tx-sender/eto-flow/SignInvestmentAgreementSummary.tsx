import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, setDisplayName } from "recompose";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { ResponsiveImage } from "../../../shared/ResponsiveImage";

import * as signGraphic from "../../../../assets/img/sign-agreement.svg";
import * as styles from "./SignInvestmentAgreementSummary.module.scss";

interface IDispatchProps {
  onAccept: () => void;
}

const SignInvestmentAgreementComponent: React.FunctionComponent<IDispatchProps> = ({
  onAccept,
}) => (
  <section className={styles.content} data-test-id="eto-flow.sign-isha-summary">
    <ResponsiveImage
      width={2}
      height={1}
      theme={"transparent"}
      srcSet={{ "1x": signGraphic }}
      alt=""
      className={styles.image}
    />
    <p className={styles.text}>
      <FormattedMessage id="download-agreement-widget.sign-on-ethereum-text-modal" />
    </p>
    <Button
      layout={EButtonLayout.PRIMARY}
      type="button"
      onClick={onAccept}
      data-test-id="eto-flow.sign-isha-summary.continue"
      className={styles.button}
    >
      <FormattedMessage id="download-agreement-widget.sign-on-ethereum" />
    </Button>
  </section>
);

const SignInvestmentAgreementSummary = compose<IDispatchProps, {}>(
  setDisplayName("SignInvestmentAgreementSummary"),
  appConnect<{}, IDispatchProps>({
    dispatchToProps: d => ({
      onAccept: () => d(actions.txSender.txSenderAccept()),
    }),
  }),
)(SignInvestmentAgreementComponent);

export { SignInvestmentAgreementComponent, SignInvestmentAgreementSummary };
