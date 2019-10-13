import { expect } from "chai";

import { convertToBigInt, isLessThanOrEqualToZero, isZero, normalize } from "./NumberUtils";

describe("convertToBigInt", () => {
  it("converts decimal currencies to bigInt representation", () => {
    expect(convertToBigInt("123.4567")).to.eq("123456700000000000000");
    expect(convertToBigInt("123.4567", 6)).to.eq("123456700");
    expect(convertToBigInt("123.4567", 2)).to.eq("12346");
    expect(convertToBigInt("65.4321", 2)).to.eq("6544");
  });
});

describe("normalize", () => {
  it("should normalize given number to a specified range", () => {
    expect(normalize({ min: 0, max: 100 }, 100)).to.eq(1);
    expect(normalize({ min: 0, max: 100 }, 0)).to.eq(0);
    expect(normalize({ min: 0, max: 100 }, 25)).to.eq(0.25);
    expect(normalize({ min: 0, max: 100 }, 80)).to.eq(0.8);
  });
});

describe("isZero", () => {
  it("should correctly recognize zeros", () => {
    expect(isZero("000000000000000000")).to.be.true;
    expect(isZero("364458900000000000")).to.be.false;
  });
});

describe("isLessThanOrEqualToZero", () => {
  it("should correctly recognize zeros and negative values", () => {
    expect(isLessThanOrEqualToZero("000000000000000000")).to.be.true;
    expect(isLessThanOrEqualToZero("-364458900000000000")).to.be.true;
    expect(isLessThanOrEqualToZero("364458900000000000")).to.be.false;
  });
});
