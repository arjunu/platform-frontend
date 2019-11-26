import { expect } from "chai";

import { testEto } from "../../../test/fixtures";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import {
  amendEtoToCompatibleFormat,
  getEtoEurMaxTarget,
  getEtoEurMinTarget,
  getEtoNextStateStartDate,
} from "./utils";

describe("eto-utils", () => {
  describe("amendEtoToCompatibleFormat", () => {
    it("should uppercase jurisdiction", () => {
      const amendedEto = amendEtoToCompatibleFormat(testEto);
      expect(testEto.product.jurisdiction).to.equal(EJurisdiction.GERMANY.toLowerCase());
      expect(amendedEto.product!.jurisdiction).to.equal(EJurisdiction.GERMANY);
    });
  });

  describe("getEtoEurMinTarget", () => {
    it("should return minimal target", () => {
      expect(getEtoEurMinTarget(testEto)).to.eq("3236982.7202791871741");
    });
  });

  describe("getEtoEurMaxTarget", () => {
    it("should return max target", () => {
      expect(getEtoEurMaxTarget(testEto)).to.eq("11174064.3504037541249932");
    });
  });

  describe("getEtoNextStateStartDate", () => {
    it("should return next state start date", () => {
      const date = getEtoNextStateStartDate(testEto)!;
      expect(date.toString()).to.eq(new Date("2018-12-21T05:03:56.000Z").toString());
    });
  });
});
