import BigNumber from "bignumber.js";
import { expect } from "chai";

import {
  bankQuantize,
  calculateBankFee,
  iso2002Quantize,
  subtractBankFee,
} from "./BankArithmetics";
import { convertToUlps } from "./NumberUtils";

describe("iso2002Quantize", () => {
  it("should correctly quantize value", () => {
    expect(iso2002Quantize("1.0001000001")).to.be.eq("1.00010");
    expect(iso2002Quantize(new BigNumber("1.0001000001"))).to.be.eq("1.00010");
    expect(iso2002Quantize("1.123")).to.be.eq("1.12300");
    expect(iso2002Quantize(new BigNumber("1.123"))).to.be.eq("1.12300");

    // half-up
    expect(iso2002Quantize("1.123456")).to.be.eq("1.12346");
    expect(iso2002Quantize(new BigNumber("1.123456"))).to.be.eq("1.12346");
    expect(iso2002Quantize("1.12345678924532")).to.be.eq("1.12346");
    expect(iso2002Quantize(new BigNumber("1.12345678924532"))).to.be.eq("1.12346");
  });
});

describe("bankQuantize", () => {
  it("should correctly quantize value", () => {
    expect(bankQuantize("1.0001000001")).to.be.eq("1.00");
    expect(bankQuantize(new BigNumber("1.0001000001"))).to.be.eq("1.00");
    expect(bankQuantize("1.123")).to.be.eq("1.12");
    expect(bankQuantize(new BigNumber("1.123"))).to.be.eq("1.12");
    expect(bankQuantize("128.123456789012345678")).to.be.eq("128.12");
    expect(bankQuantize(new BigNumber("128.123456789012345678"))).to.be.eq("128.12");

    // down
    expect(bankQuantize("1.126999")).to.be.eq("1.12");
    expect(bankQuantize(new BigNumber("1.126999"))).to.be.eq("1.12");
  });
});

describe("subtractBankFee", () => {
  it("should correctly calculate value with fee subtracted", () => {
    expect(subtractBankFee(convertToUlps("12222.32"), convertToUlps("0.005"))).to.be.eq("12161.20");
    expect(subtractBankFee(convertToUlps("80336.39"), convertToUlps("0.007"))).to.be.eq("79774.03");
    expect(subtractBankFee(convertToUlps("14873.97"), convertToUlps("0.004"))).to.be.eq("14814.47");
    expect(subtractBankFee(convertToUlps("132.22"), convertToUlps("0.005"))).to.be.eq("131.55");
  });
});

describe("calculateBankFee", () => {
  it("should correctly calculate value with fee subtracted", () => {
    expect(
      calculateBankFee(
        convertToUlps("12222.32"),
        subtractBankFee(convertToUlps("12222.32"), convertToUlps("0.005")),
      ),
    ).to.be.eq("61.12");
    expect(
      calculateBankFee(
        convertToUlps("80336.39"),
        subtractBankFee(convertToUlps("80336.39"), convertToUlps("0.007")),
      ),
    ).to.be.eq("562.36");
    expect(
      calculateBankFee(
        convertToUlps("14873.97"),
        subtractBankFee(convertToUlps("14873.97"), convertToUlps("0.004")),
      ),
    ).to.be.eq("59.50");
    expect(
      calculateBankFee(
        convertToUlps("132.22"),
        subtractBankFee(convertToUlps("132.22"), convertToUlps("0.005")),
      ),
    ).to.be.eq("0.67");
  });
});
