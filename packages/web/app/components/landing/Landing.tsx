import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { externalRoutes } from "../../config/externalRoutes";
import { etoMockCompanies } from "../../data/etoCompanies";
import { withContainer } from "../../utils/withContainer.unsafe";
import { appRoutes } from "../appRoutes";
import { EtoList } from "../dashboard/eto-list/EtoList";
import { Container, EColumnSpan, EContainerType } from "../layouts/Container";
import { Content, EContentWidth } from "../layouts/Content";
import { Layout } from "../layouts/Layout";
import { WidgetGrid } from "../layouts/WidgetGrid";
import {
  ButtonGroup,
  ButtonLink,
  EButtonLayout,
  EButtonSize,
  EIconPosition,
} from "../shared/buttons";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";

import * as arrowRight from "../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./Landing.module.scss";

const LandingLayout: React.FunctionComponent = () => (
  <>
    <section className={styles.landing} data-test-id="landing-page">
      <Content>
        <div className={styles.neon} />

        <WidgetGrid>
          <Container columnSpan={EColumnSpan.ONE_AND_HALF_COL} type={EContainerType.GRID}>
            <h1 className={styles.header}>
              <FormattedMessage id="platform.landing.featured.header" />
            </h1>
            <p className={styles.description}>
              <FormattedMessage id="platform.landing.featured.description" />
            </p>
          </Container>

          <Container
            className={styles.featuresContainer}
            columnSpan={EColumnSpan.ONE_AND_HALF_COL}
            type={EContainerType.GRID}
          >
            <ul className={cn(styles.features)}>
              <li className={cn(styles.featuresItem, styles.featuresItemInvest)}>
                <FormattedMessage id="platform.landing.list.first" />
              </li>
              <li className={cn(styles.featuresItem, styles.featuresItemMinTicket)}>
                <FormattedMessage id="platform.landing.list.second" />
              </li>
              <li className={cn(styles.featuresItem, styles.featuresItemTradable)}>
                <FormattedMessage id="platform.landing.list.third" />
              </li>
            </ul>
          </Container>
        </WidgetGrid>
      </Content>
    </section>

    <Content>
      <section className={styles.investmentOpportunities}>
        <h2 className={cn(styles.investmentOpportunitiesHeader)}>Investment opportunities</h2>

        <EtoList mockedEtos={etoMockCompanies} shouldOpenInNewWindow={true} />

        <ButtonGroup className={styles.investmentOpportunitiesCallToAction}>
          <ButtonLink
            layout={EButtonLayout.PRIMARY}
            size={EButtonSize.HUGE}
            to={appRoutes.register}
          >
            <FormattedMessage id="wallet-selector.register" />
          </ButtonLink>
          <ButtonLink
            iconPosition={EIconPosition.ICON_AFTER}
            layout={EButtonLayout.GHOST}
            size={EButtonSize.HUGE}
            svgIcon={arrowRight}
            target={"_blank"}
            to={externalRoutes.neufundInvest}
          >
            <FormattedMessage id="common.text.read-more" />
          </ButtonLink>
        </ButtonGroup>
      </section>
    </Content>
  </>
);

const Landing = compose(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(
    withProps<React.ComponentProps<typeof Layout>, {}>({
      width: EContentWidth.FULL,
    })(Layout),
  ),
)(LandingLayout);

export { Landing };
