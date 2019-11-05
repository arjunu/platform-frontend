import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EWhitelistingState } from "../../../modules/bookbuilding-flow/utils";
import { BookBuildingWidgetComponent } from "./BookBuildingWidget";

const data = {
  startBookBuilding: action("startBookBuilding"),
  stopBookBuilding: action("stopBookBuilding"),
  downloadCSV: action("downloadCSV"),
  etoId: "some-eto-id",
  bookBuildingStats: { investorsCount: 0, pledgedAmount: 0 },
  maxPledges: 500,
  minOffsetPeriod: 17345,
  isAuthorized: true,
};

storiesOf("BookBuildingWidget", module)
  .add("bookbuilding disabled", () => (
    <BookBuildingWidgetComponent {...data} whitelistingState={EWhitelistingState.STOPPED} />
  ))
  .add("whitelisting not started", () => (
    <BookBuildingWidgetComponent {...data} whitelistingState={EWhitelistingState.NOT_ACTIVE} />
  ))
  .add("whitelisting started, no data yet", () => (
    <BookBuildingWidgetComponent {...data} whitelistingState={EWhitelistingState.ACTIVE} />
  ))
  .add("whitelisting started, there are pledges", () => {
    const testData = {
      ...data,
      whitelistingState: EWhitelistingState.ACTIVE,
      bookBuildingStats: { investorsCount: 2, pledgedAmount: 12545874 },
    };
    return <BookBuildingWidgetComponent {...testData} />;
  })
  .add("whitelisting paused", () => {
    const testData = {
      ...data,
      whitelistingState: EWhitelistingState.SUSPENDED,
      bookBuildingStats: { investorsCount: 2, pledgedAmount: 1595848 },
    };
    return <BookBuildingWidgetComponent {...testData} />;
  })
  .add("whitelisting stopped", () => {
    const testData = {
      ...data,
      whitelistingState: EWhitelistingState.STOPPED,
      bookBuildingStats: { investorsCount: 2, pledgedAmount: 1595848 },
    };
    return <BookBuildingWidgetComponent {...testData} />;
  })
  .add("whitelisting limit reached", () => {
    const testData = {
      ...data,
      whitelistingState: EWhitelistingState.LIMIT_REACHED,
      bookBuildingStats: { investorsCount: 2, pledgedAmount: 1595848 },
    };
    return <BookBuildingWidgetComponent {...testData} />;
  });
