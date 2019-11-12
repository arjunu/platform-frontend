import BigNumber from "bignumber.js";
import { expect } from "chai";

import { ENumberInputFormat } from "../components/shared/formatters/utils";
import {
  bankQuantize,
  calculateBankFee,
  iso2002Quantize,
  subtractBankFee,
} from "./BankArithmetics";
import { convertToUlps } from "./NumberUtils";

describe("iso2002Quantize", () => {
  it("should correctly quantize value", () => {
    it("Float values", () => {
      expect(iso2002Quantize("1.0001000001", ENumberInputFormat.FLOAT)).to.be.eq("1.00010");
      expect(iso2002Quantize("1.123", ENumberInputFormat.FLOAT)).to.be.eq("1.12300");

      // half-up
      expect(iso2002Quantize("1.123456", ENumberInputFormat.FLOAT)).to.be.eq("1.12346");

      // quantization from str
      expect(iso2002Quantize("128.123456789012345678", ENumberInputFormat.FLOAT)).to.be.eq(
        "128.12346",
      );

      // quantization from BigNumber
      expect(
        iso2002Quantize(new BigNumber("128.123456789012345678"), ENumberInputFormat.FLOAT),
      ).to.be.eq("128.12346");
    });

    it("ULPS values", () => {
      expect(iso2002Quantize(convertToUlps("1.0001000001"), ENumberInputFormat.ULPS)).to.be.eq(
        "1.00010",
      );
      expect(iso2002Quantize(convertToUlps("1.123456"), ENumberInputFormat.ULPS)).to.be.eq(
        "1.12346",
      );
      expect(
        iso2002Quantize(convertToUlps("128.123456789012345678"), ENumberInputFormat.ULPS),
      ).to.be.eq("128.12346");
    });
  });
});

describe("bankQuantize", () => {
  it("should correctly quantize value", () => {
    it("Float values", () => {
      expect(bankQuantize("1.0001000001", ENumberInputFormat.FLOAT)).to.be.eq("1.00");
      expect(bankQuantize("1.123", ENumberInputFormat.FLOAT)).to.be.eq("1.12");

      // down
      expect(bankQuantize("1.126999", ENumberInputFormat.FLOAT)).to.be.eq("1.12");

      // quantization from str
      expect(bankQuantize("128.123456789012345678", ENumberInputFormat.FLOAT)).to.be.eq("128.12");

      // quantization from BigNumber
      expect(
        bankQuantize(new BigNumber("128.123456789012345678"), ENumberInputFormat.FLOAT),
      ).to.be.eq("128.12");
    });

    it("ULPS values", () => {
      expect(bankQuantize(convertToUlps("1.0001000001"), ENumberInputFormat.ULPS)).to.be.eq("1.00");
      expect(bankQuantize(convertToUlps("1.123"), ENumberInputFormat.ULPS)).to.be.eq("1.12");
      expect(
        bankQuantize(convertToUlps("128.123456789012345678"), ENumberInputFormat.ULPS),
      ).to.be.eq("128.12");
    });
  });
});

describe("subtractBankFee", () => {
  it("should correctly calculate value with fee subtracted", () => {
    expect(subtractBankFee(convertToUlps("12222.32"), convertToUlps("0.005"))).to.be.eq("12161.20");
    expect(subtractBankFee(convertToUlps("80336.39"), convertToUlps("0.007"))).to.be.eq("79774.03");
    expect(subtractBankFee(convertToUlps("14873.97"), convertToUlps("0.004"))).to.be.eq("14814.47");
  });
});

describe("calculateBankFee", () => {
  it("should correctly calculate value with fee subtracted", () => {
    expect(calculateBankFee(convertToUlps("12222.32"), convertToUlps("0.005"))).to.be.eq("61.12");
    expect(calculateBankFee(convertToUlps("80336.39"), convertToUlps("0.007"))).to.be.eq("562.36");
    expect(calculateBankFee(convertToUlps("14873.97"), convertToUlps("0.004"))).to.be.eq("59.5");
  });
});
