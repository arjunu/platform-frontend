import * as React from "react";

import { lazyLoad } from "../../utils/lazyLoad";

const NomineeDashboard: React.LazyExoticComponent<React.ComponentType> = React.lazy(() =>
  import("./NomineeDashboard").then(exports => ({ default: exports.NomineeDashboard })),
);

export const NomineeDashboardLazy = lazyLoad(NomineeDashboard);
