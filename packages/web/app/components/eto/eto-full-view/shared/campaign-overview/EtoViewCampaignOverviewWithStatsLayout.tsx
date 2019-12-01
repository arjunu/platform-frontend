import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Route } from "react-router";

import { TCampaignOverviewWithStatsData } from "../../../../../modules/eto-view/shared/types";
import { SwitchConnected } from "../../../../../utils/connectedRouting";
import { Container, EColumnSpan } from "../../../../layouts/Container";
import { WidgetGrid } from "../../../../layouts/WidgetGrid";
import { TabContent, Tabs } from "../../../../shared/Tabs";
import { TEtoViewCampaignOverviewProps } from "./EtoViewCampaignOverview";
import { EtoViewCampaignOverviewLayout } from "./EtoViewCampaignOverviewLayout";
import { EtoViewFundraisingStatistics } from "./fundrising-stats/EtoViewFundraisingStatistics";

import * as styles from "../EtoView.module.scss";

export const EtoViewCampaignOverviewWithStatsLayout: React.FunctionComponent<TEtoViewCampaignOverviewProps & {
  tabsData: TCampaignOverviewWithStatsData;
}> = ({ eto, publicView, isUserFullyVerified, data, tabsData: { url, path } }) => (
  <Container id="eto-view-tabs" columnSpan={EColumnSpan.THREE_COL}>
    <Tabs
      className="mb-3"
      layoutSize="large"
      layoutOrnament={true}
      data-test-id="eto.public-view.campaign-overview"
    >
      <TabContent
        tab={<FormattedMessage id="eto.public-view.campaign-overview" />}
        routerPath={url}
      />
      <TabContent
        tab={<FormattedMessage id="eto.public-view.fundraising-statistics" />}
        data-test-id="eto.public-view.fundraising-statistics"
        routerPath={`${url}/stats`}
      />
    </Tabs>
    <SwitchConnected>
      <Route
        path={path}
        render={() => (
          <WidgetGrid className={styles.etoLayout} data-test-id="eto.public-view">
            <EtoViewCampaignOverviewLayout
              eto={eto}
              isUserFullyVerified={isUserFullyVerified}
              publicView={publicView}
              data={data}
            />
          </WidgetGrid>
        )}
        exact
      />
      <Route
        path={`${path}/stats`}
        render={() => <EtoViewFundraisingStatistics etoId={eto.etoId} />}
      />
    </SwitchConnected>
  </Container>
);
