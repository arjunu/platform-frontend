import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BookBuildingWidgetComponent } from "./BookBuildingWidget";

const data = {
  startBookBuilding: () => {},
  stopBookBuilding: () => {},
  downloadCSV: () => {},
  etoId: "some-eto-id",
  bookBuildingEnabled: false,
  bookBuildingStats: { investorsCount: 0, pledgedAmount: 0 },
  maxPledges: 500,
  canEnableBookbuilding: true,
  minOffsetPeriod: 17345,
};

storiesOf("BookBuildingWidget", module)
  .add("bookbuilding disabled", () => (
    <BookBuildingWidgetComponent {...data} canEnableBookbuilding={false} />
  ))
  .add("whitelisting not started", () => <BookBuildingWidgetComponent {...data} />)
  .add("whitelisting started, no data yet", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: true,
    };
    return <BookBuildingWidgetComponent {...testData} />;
  })
  .add("whitelisting started, there are pledges", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: true,
      bookBuildingStats: { investorsCount: 2, pledgedAmount: 12545874 },
    };
    return <BookBuildingWidgetComponent {...testData} />;
  })
  .add("whitelisting paused", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: false,
      bookBuildingStats: { investorsCount: 2, pledgedAmount: 1595848 },
    };
    return <BookBuildingWidgetComponent {...testData} />;
  });
