import { withContainer } from "@neufund/shared";
import * as React from "react";
import { compose } from "redux";

import { TransitionalLayout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";

const RecoverRouter = React.lazy(() =>
  import("./router/RecoverRouter").then(imp => ({ default: imp.RecoverRouter })),
);

export const WalletRecoverMainComponent: React.FunctionComponent = () => <RecoverRouter />;

export const WalletRecoverMain: React.FunctionComponent = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayout),
  withContainer(TransitionalLayout),
)(WalletRecoverMainComponent);
