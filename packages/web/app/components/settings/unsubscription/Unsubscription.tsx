import { isEmail, withContainer } from "@neufund/shared";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent, withProps } from "recompose";

import { externalRoutes } from "../../../config/externalRoutes";
import { actions } from "../../../modules/actions";
import { selectUnsubscriptionLinkFromQueryString } from "../../../modules/marketing-emails/selectors";
import { isValidLink } from "../../../modules/marketing-emails/utils";
import { appConnect } from "../../../store";
import { EContentWidth } from "../../layouts/Content";
import { Layout } from "../../layouts/Layout";
import { Button, EButtonLayout } from "../../shared/buttons/Button";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { Heading } from "../../shared/Heading";
import { ExternalLink } from "../../shared/links/ExternalLink";

import * as styles from "./Unsubscription.module.scss";

interface IRouterParams {
  email: string;
}

interface IStateProps {
  unsubscriptionLink: string | undefined;
}

interface IDispatchProps {
  unsubscribe: () => void;
  goToHome: () => void;
}

type TComponentProps = IRouterParams & IStateProps & IDispatchProps;

const UnsubscriptionLayout: React.FunctionComponent<TComponentProps> = ({ email, unsubscribe }) => (
  <section className={styles.container}>
    <Heading level={1} titleClassName={styles.header} decorator={false}>
      <FormattedMessage id="settings.unsubscription.confirmation" />
    </Heading>

    <p className={styles.description}>
      <FormattedHTMLMessage
        id="settings.unsubscription.confirmation.description"
        values={{ email }}
        tagName="span"
      />
    </p>
    <Button layout={EButtonLayout.PRIMARY} onClick={unsubscribe}>
      <FormattedMessage id="settings.unsubscription.button" />
    </Button>
  </section>
);

const UnsubscriptionInvalidLayout: React.FunctionComponent<TComponentProps> = ({ goToHome }) => (
  <section className={styles.container}>
    <Heading level={1} titleClassName={styles.header} decorator={false}>
      <FormattedMessage id="settings.unsubscription.invalid" />
    </Heading>
    <p className={styles.description}>
      <FormattedMessage
        id="settings.unsubscription.invalid.description"
        values={{
          supportDesk: (
            <ExternalLink href={externalRoutes.neufundSupportHome}>
              <FormattedMessage id="support-desk.link.text" />
            </ExternalLink>
          ),
        }}
      />
    </p>
    <Button onClick={goToHome} layout={EButtonLayout.PRIMARY}>
      <FormattedMessage id="settings.unsubscription.visit" />
    </Button>
  </section>
);

const Unsubscription = compose<TComponentProps, IRouterParams>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      unsubscriptionLink: selectUnsubscriptionLinkFromQueryString(s),
    }),
    dispatchToProps: dispatch => ({
      unsubscribe: () => dispatch(actions.marketingEmails.unsubscribe()),
      goToHome: () => dispatch(actions.routing.goHome()),
    }),
  }),
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(
    withProps<React.ComponentProps<typeof Layout>, {}>({
      width: EContentWidth.FULL,
    })(Layout),
  ),
  withProps((props: IRouterParams) => ({
    email: decodeURIComponent(props.email),
  })),
  branch<IRouterParams & IStateProps>(
    props => !isEmail(props.email),
    renderComponent(UnsubscriptionInvalidLayout),
  ),
  branch<IRouterParams & IStateProps>(
    props => !props.unsubscriptionLink || !isValidLink(props.unsubscriptionLink),
    renderComponent(UnsubscriptionInvalidLayout),
  ),
)(UnsubscriptionLayout);

export { UnsubscriptionLayout, UnsubscriptionInvalidLayout, Unsubscription };
