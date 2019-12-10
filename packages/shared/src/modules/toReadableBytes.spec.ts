import { expect } from "chai";

import { toReadableBytes } from "./toReadableBytes";

describe("toReadableBytes", () => {
  it("should properly convert bytes", () => {
    expect(toReadableBytes(0)).to.eq("0 B");

    expect(toReadableBytes(999)).to.eq("999.00 B");

    expect(toReadableBytes(9874321)).to.eq("9.87 MB");

    expect(toReadableBytes(10000000000)).to.eq("10.00 GB");

    expect(toReadableBytes(712893712304234)).to.eq("712.89 TB");

    expect(toReadableBytes(6212893712323224)).to.eq("6.21 PB");
  });
});
