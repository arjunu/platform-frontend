import BigNumber from "bignumber.js";
import { expect } from "chai";

import {
  addBigNumbers,
  compareBigNumbers,
  divideBigNumbers,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "./BigNumberUtils";

describe("BigNumber Utils", () => {
  describe("addBigNumbers", () => {
    it("should add", () => {
      expect(addBigNumbers(["100", "200", "1"])).to.be.eq("301");
      expect(addBigNumbers(["100", new BigNumber("200"), "1"])).to.be.eq("301");
    });
  });

  describe("subtractBigNumbers", () => {
    it("should subtract", () => {
      expect(subtractBigNumbers(["500", "200", "1"])).to.be.eq("299");
      expect(subtractBigNumbers(["500", new BigNumber("200"), "1"])).to.be.eq("299");
    });
  });

  describe("multiplyBigNumbers", () => {
    it("should multiply", () => {
      expect(multiplyBigNumbers(["10", "3", "5"])).to.be.eq("150");
      expect(multiplyBigNumbers(["10", "3", new BigNumber("5")])).to.be.eq("150");
    });
  });

  describe("divideBigNumbers", () => {
    it("should divide", () => {
      expect(divideBigNumbers("1000", "5")).to.eq("200");
      expect(divideBigNumbers("1000", new BigNumber("5"))).to.eq("200");
    });
  });

  describe("compareBigNumbers", () => {
    it("compares big numbers", () => {
      expect(compareBigNumbers("1000", "10")).to.equal(1);
      expect(compareBigNumbers("1000", "1000")).to.equal(0);
      expect(compareBigNumbers("1000", "1001")).to.equal(-1);
    });
  });
});
