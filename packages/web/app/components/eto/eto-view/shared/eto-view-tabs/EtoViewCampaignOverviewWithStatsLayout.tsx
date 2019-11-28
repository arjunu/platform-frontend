import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Route } from "react-router";

import { Container, EColumnSpan } from "../../../../layouts/Container";
import { TabContent, Tabs } from "../../../../shared/Tabs";
import { SwitchConnected } from "../../../../../utils/connectedRouting";
import { WidgetGrid } from "../../../../layouts/WidgetGrid";
import { EtoViewFundraisingStatistics } from "../../../shared/EtoViewFundraisingStatistics";
import { TEtoViewCampaignOverviewProps } from "./EtoViewCampaignOverview";
import { EtoViewCampaignOverviewLayout } from "./EtoViewCampaignOverviewLayout";
import { TCampaignOverviewWithStatsData } from "../../../../../modules/eto-view/reducer";

import * as styles from "../../../shared/EtoView.module.scss";

export const EtoViewCampaignOverviewWithStatsLayout: React.FunctionComponent<TEtoViewCampaignOverviewProps & { data: TCampaignOverviewWithStatsData }> = ({
  eto,
  publicView,
  isUserFullyVerified,
  data: {
    url,
    path
  }
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
