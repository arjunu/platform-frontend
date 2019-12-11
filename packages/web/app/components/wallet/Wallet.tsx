import { withContainer, withMetaTags } from "@neufund/shared";
import * as React from "react";
import { compose } from "redux";

import { Layout } from "../layouts/Layout";
import { WidgetGrid } from "../layouts/WidgetGrid";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { WalletRouter } from "./Router";

import * as layoutStyles from "../layouts/WidgetGrid.module.scss";

export const WalletComponent: React.FunctionComponent = () => (
  <WidgetGrid data-test-id="wallet-start-container" className={layoutStyles.layoutOffset}>
    <WalletRouter />
  </WidgetGrid>
);

export const Wallet = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(Layout),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.wallet") })),
)(WalletComponent);
