import { expect } from "chai";

import { convertToUlps } from "../../../../utils/NumberUtils";
import { getPossibleMaxUlps } from "./utils";

describe("getPossibleMaxUlps", () => {
  it("should correctly select value", () => {
    expect(getPossibleMaxUlps(convertToUlps("10278127.1988124"), "10278127.19")).to.be.eq(
      convertToUlps("10278127.1988124"),
    );
    expect(getPossibleMaxUlps(convertToUlps("10278127.1988124"), "124.28")).to.be.eq(
      convertToUlps("124.28"),
    );

    // with precision provided
    expect(getPossibleMaxUlps(convertToUlps("10278127.1988124"), "10278127.19")).to.be.eq(
      convertToUlps("10278127.1988124"),
    );
    expect(getPossibleMaxUlps(convertToUlps("10278127.1988124"), "124.28")).to.be.eq(
      convertToUlps("124.28"),
    );
  });
});
