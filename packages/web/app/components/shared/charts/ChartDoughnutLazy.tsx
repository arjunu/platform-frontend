import * as React from "react";

import { LoadingIndicator } from "../loading-indicator/LoadingIndicator";

const ChartDoughnut = React.lazy(() =>
  import("./ChartDoughnut.unsafe").then(imp => ({ default: imp.ChartDoughnut })),
);

/**
 * @note We need to wrap lazy loaded chart into suspense to prevent `PeopleSwiperWidget` wrong width calculation bug
 */
const ChartDoughnutLazy: React.FunctionComponent<React.ComponentProps<
  typeof ChartDoughnut
>> = props => (
  <React.Suspense fallback={<LoadingIndicator />}>
    <ChartDoughnut {...props} />
  </React.Suspense>
);

export { ChartDoughnutLazy };
