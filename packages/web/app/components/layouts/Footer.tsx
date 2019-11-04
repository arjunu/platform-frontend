import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../config/externalRoutes";
import { selectIsAuthorized } from "../../modules/auth/selectors";
import { appConnect } from "../../store";
import { ExternalLink } from "../shared/links/index";

import * as styles from "./Footer.module.scss";

interface IStateProps {
  isAuthorized: boolean;
}

export const FooterLayout: React.FunctionComponent<IStateProps> = ({ isAuthorized }) => (
  <footer className={styles.footer}>
    <span className={styles.copyright}>©2019 Fifth Force GmbH</span>
    <ExternalLink href={externalRoutes.imprint} className={styles.link}>
      <FormattedMessage id="footer.links.imprint" />
    </ExternalLink>
    {isAuthorized && (
      <ExternalLink href={externalRoutes.tos} className={styles.link}>
        <FormattedMessage id="footer.links.terms-of-use" />
      </ExternalLink>
    )}
    <ExternalLink href={externalRoutes.privacyPolicy} className={styles.link}>
      <FormattedMessage id="footer.links.privacy-policy" />
    </ExternalLink>
  </footer>
);

export const Footer = appConnect<IStateProps>({
  stateToProps: state => ({
    isAuthorized: selectIsAuthorized(state),
  }),
})(FooterLayout);
