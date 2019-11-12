import BigNumber from "bignumber.js";
import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";

import { NumberFormat } from "./NumberFormat";

describe("NumberFormat", () => {
  it("Should format number", () => {
    expect(shallow(<NumberFormat value={"10000"} />).text()).to.eq("10 000");
    expect(shallow(<NumberFormat value={"1000"} />).text()).to.eq("1 000");
    expect(shallow(<NumberFormat value={"100"} />).text()).to.eq("100");
    expect(shallow(<NumberFormat value={"10000.123"} />).text()).to.eq("10 000.123");
  });

  it("Should format string", () => {
    expect(shallow(<NumberFormat value={"10000"} />).text()).to.eq("10 000");
    expect(shallow(<NumberFormat value={"1000"} />).text()).to.eq("1 000");
    expect(shallow(<NumberFormat value={"100"} />).text()).to.eq("100");
    expect(shallow(<NumberFormat value={"10000.123"} />).text()).to.eq("10 000.123");
  });

  it("Should format BigNumber", () => {
    expect(shallow(<NumberFormat value={new BigNumber("1234567e3")} />).text()).to.eq(
      "1 234 567 000",
    );
    expect(shallow(<NumberFormat value={new BigNumber("1.23456780123456789e+9")} />).text()).to.eq(
      "1 234 567 801.23456789",
    );
    expect(shallow(<NumberFormat value={new BigNumber("1234567.898765")} />).text()).to.eq(
      "1 234 567.898765",
    );
  });
});
