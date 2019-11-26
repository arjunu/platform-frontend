import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, setDisplayName, withProps } from "recompose";

import { actions } from "../../modules/actions";
import { TDataTestId } from "../../types";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Container, EColumnSpan } from "../layouts/Container";
import { Layout } from "../layouts/Layout";
import { WidgetGrid } from "../layouts/WidgetGrid";
import { Heading } from "../shared/Heading";
import { EtoList } from "./eto-list/EtoList";
import { MyPortfolioWidget } from "./my-portfolio/MyPortfolioWidget";
import { MyWalletWidget } from "./my-wallet/MyWalletWidget";

export const DashboardLayout = () => (
  <WidgetGrid>
    <MyPortfolioWidget />
    <MyWalletWidget />
    {process.env.NF_EQUITY_TOKEN_OFFERINGS_VISIBLE === "1" && (
      <>
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <Heading level={3} decorator={false}>
            <FormattedMessage id="dashboard.eto-opportunities" />
          </Heading>

          <p>
            <FormattedMessage id="dashboard.eto-opportunities.description" />
          </p>
        </Container>

        <EtoList />
      </>
    )}
  </WidgetGrid>
);

export const Dashboard = compose<{}, {}>(
  setDisplayName("Dashboard"),
  onEnterAction({
    actionCreator: d => {
      d(actions.wallet.loadWalletData());
    },
  }),
  withContainer(
    withProps<TDataTestId, {}>({ "data-test-id": "dashboard-application" })(Layout),
  ),
)(DashboardLayout);
