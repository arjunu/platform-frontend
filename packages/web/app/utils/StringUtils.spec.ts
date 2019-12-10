import { extractNumber, getHostname, isExternalUrl } from "@neufund/shared"
import { expect } from "chai";

describe("StringUtils", () => {
  describe("extractNumber", () => {
    it("extracts only numerical values from a string", () => {
      expect(extractNumber("123asdf .23")).to.eq("123.23");
    });
  });

  describe("isExternalUrl", () => {
    it("should return true for external https url", () => {
      expect(isExternalUrl("https://neufund.org")).to.be.true;
    });

    it("should return true for external http url", () => {
      expect(isExternalUrl("http://neufund.org")).to.be.true;
    });

    it("should return false for local url", () => {
      expect(isExternalUrl("/register")).to.be.false;
    });
  });
});

describe("getHostname", () => {
  it("should return hostname from link", () => {
    expect(getHostname("https://www.sec.gov/fast-answers/answers-accredhtm.html")).to.eq(
      "www.sec.gov",
    );
    expect(
      getHostname(
        "https://www.ecfr.gov/cgi-bin/retrieveECFR?gp=&SID=8edfd12967d69c024485029d968ee737&r=SECTION&n=17y3.0.1.1.12.0.46.176",
      ),
    ).to.eq("www.ecfr.gov");
  });
});
