import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Route } from "react-router";

import { Container, EColumnSpan } from "../../../layouts/Container";
import { TabContent, Tabs } from "../../../shared/Tabs";
import { SwitchConnected } from "../../../../utils/connectedRouting";
import { WidgetGrid } from "../../../layouts/WidgetGrid";
import { EtoViewFundraisingStatistics } from "../EtoViewFundraisingStatistics";
import { IEtoViewTabsExternalProps, IEtoViewTabsState } from "./EtoViewTabs";
import { EtoViewCampaignOverview } from "./EtoViewCampaignOverview";

import * as styles from "../EtoView.module.scss";

export const EtoViewTabsLayout: React.FunctionComponent<IEtoViewTabsState & IEtoViewTabsExternalProps> = ({
  eto,
  publicView,
  isUserFullyVerified,
  match,
}) => (
  <Container id="eto-view-tabs" columnSpan={EColumnSpan.THREE_COL}>

    <Tabs
      className="mb-3"
      layoutSize="large"
      layoutOrnament={true}
      data-test-id="eto.public-view.campaign-overview"
    >
      <TabContent
        tab={<FormattedMessage id="eto.public-view.campaign-overview" />}
        routerPath={match.url}
      />
      <TabContent
        tab={<FormattedMessage id="eto.public-view.fundraising-statistics" />}
        data-test-id="eto.public-view.fundraising-statistics"
        routerPath={`${match.url}/stats`}
      />
    </Tabs>
    <SwitchConnected>
      <Route
        path={match.path}
        render={() => (
          <WidgetGrid className={styles.etoLayout} data-test-id="eto.public-view">
            <EtoViewCampaignOverview
              eto={eto}
              isUserFullyVerified={isUserFullyVerified}
              publicView={publicView}
            />
          </WidgetGrid>
        )}
        exact
      />
      <Route
        path={`${match.path}/stats`}
        render={() => <EtoViewFundraisingStatistics etoId={eto.etoId} />}
      />
    </SwitchConnected>
  </Container>
);
