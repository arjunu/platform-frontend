import { expect } from "chai";
import { mount } from "enzyme";
import * as moment from "moment";
import * as React from "react";
import * as sinon from "sinon";

import { wrapWithIntl } from "../../../../../test/integrationTestUtils.unsafe";
import { EndTimeWidget } from "./EndTimeWidget";

const TIMESTAMP = new Date("Fri Oct 25 2019 10:00:00 UTC").getTime();

describe("<EndTimeWidget />", () => {
  let clock: sinon.SinonFakeTimers;
  beforeEach(() => {
    // stop passing time to avoid false negatives;
    clock = sinon.useFakeTimers(TIMESTAMP);
  });

  afterEach(() => {
    clock.restore();
  });

  it("should render text for few days", () => {
    const component = wrapWithIntl(
      <EndTimeWidget
        endTime={moment()
          .add(3, "days")
          .toDate()}
      />,
    );
    expect(mount(component).text()).to.eq("Ends in 3 days");
  });

  it("should render text for one day", () => {
    const component = wrapWithIntl(
      <EndTimeWidget
        endTime={moment()
          .add(1, "days")
          .toDate()}
      />,
    );

    expect(mount(component).text()).to.eq("Ends tomorrow At 10:00 AM UTC");
  });

  it("should render text for few hours", () => {
    const component = wrapWithIntl(
      <EndTimeWidget
        endTime={moment()
          .add(8, "hours")
          .toDate()}
      />,
    );

    expect(mount(component).text()).to.eq("Ends today At 6:00 PM UTC");
  });

  it("should render text for one hour", () => {
    const component = wrapWithIntl(
      <EndTimeWidget
        endTime={moment()
          .add(1, "hours")
          .toDate()}
      />,
    );

    expect(mount(component).text()).to.eq("Ends today At 11:00 AM UTC");
  });

  it("should render text for few minutes", () => {
    const component = wrapWithIntl(
      <EndTimeWidget
        endTime={moment()
          .add(50, "minutes")
          .toDate()}
      />,
    );

    expect(mount(component).text()).to.eq("Ends today At 10:50 AM UTC");
  });

  it("should render text for one minute", () => {
    const component = wrapWithIntl(
      <EndTimeWidget
        endTime={moment()
          .add(1, "minutes")
          .toDate()}
      />,
    );

    expect(mount(component).text()).to.eq("Ends today At 10:01 AM UTC");
  });
});
