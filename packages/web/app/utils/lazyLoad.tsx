import * as React from "react";
import { compose } from "recompose";

import { createErrorBoundary } from "../components/shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../components/shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../components/shared/loading-indicator/LoadingIndicator";

export const waitForLazyLoading = (Fallback: React.ComponentType) => (
  WrappedComponent: React.ComponentType,
) => () => (
  <React.Suspense fallback={<Fallback />}>
    <WrappedComponent />
  </React.Suspense>
);

export const lazyLoad = <T extends {}>(
  WrappedComponent: React.ComponentType<T>,
  Fallback: React.ComponentType = LoadingIndicator,
) =>
  compose<T, T>(
    createErrorBoundary(ErrorBoundaryLayout),
    waitForLazyLoading(Fallback),
  )(WrappedComponent);
