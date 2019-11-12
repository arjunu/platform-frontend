import { expect } from "chai";

import { convertToUlps } from "../../../../utils/NumberUtils";
import { getRedeemValueUlps } from "./utils";

describe("getRedeemValueUlps", () => {
  it("should correctly select value", () => {
    expect(getRedeemValueUlps(convertToUlps("10278127.1988124"), "10278127.19")).to.be.eq(
      convertToUlps("10278127.1988124"),
    );
    expect(getRedeemValueUlps(convertToUlps("10278127.1988124"), "124.28")).to.be.eq(
      convertToUlps("124.28"),
    );

    // with precision provided
    expect(getRedeemValueUlps(convertToUlps("10278127.1988124"), "10278127.19")).to.be.eq(
      convertToUlps("10278127.1988124"),
    );
    expect(getRedeemValueUlps(convertToUlps("10278127.1988124"), "124.28")).to.be.eq(
      convertToUlps("124.28"),
    );
  });
});
