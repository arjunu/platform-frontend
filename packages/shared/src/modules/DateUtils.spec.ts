import { expect } from "chai";

import {
  formatDate,
  isLessThanNDays,
  isLessThanNHours,
  isLessThanNMinutes,
  minutesToMs,
  secondsToMs,
} from "./DateUtils";

describe("date utils", () => {
  describe("formatDate", () => {
    it("formats dates", () => {
      const date = new Date("12/24/2018");
      expect(formatDate(date.getTime())).to.equal("12/24/2018");
    });
  });

  describe("isLessThanNDays", () => {
    it("compares dates", () => {
      const date1 = new Date("12/24/2018");
      const date2 = new Date("12/20/2018");
      const date3 = new Date("12/22/2018");
      const date4 = new Date("12/21/2018");

      expect(isLessThanNDays(date2, date1, 3)).to.be.false;
      expect(isLessThanNDays(date3, date1, 3)).to.be.true;
      expect(isLessThanNDays(date4, date1, 3)).to.be.false;
      expect(isLessThanNDays(date4, date1, 4)).to.be.true;
    });
  });

  describe("isLessThanNHours", () => {
    it("compares dates", () => {
      const date1 = new Date("2018-12-24T10:00:00Z");
      const date2 = new Date("2018-12-24T06:00:00Z");
      const date3 = new Date("2018-12-24T08:00:00Z");
      const date4 = new Date("2018-12-24T07:00:00Z");

      expect(isLessThanNHours(date2, date1, 3)).to.be.false;
      expect(isLessThanNHours(date3, date1, 3)).to.be.true;
      expect(isLessThanNHours(date4, date1, 3)).to.be.false;
      expect(isLessThanNHours(date4, date1, 4)).to.be.true;
    });
  });

  describe("isLessThanNMinutes", () => {
    it("compares dates", () => {
      const date1 = new Date("2018-12-24T10:10:00Z");
      const date2 = new Date("2018-12-24T10:06:00Z");
      const date3 = new Date("2018-12-24T10:08:00Z");
      const date4 = new Date("2018-12-24T10:07:00Z");

      expect(isLessThanNMinutes(date2, date1, 3)).to.be.false;
      expect(isLessThanNMinutes(date3, date1, 3)).to.be.true;
      expect(isLessThanNMinutes(date4, date1, 3)).to.be.false;
      expect(isLessThanNMinutes(date4, date1, 4)).to.be.true;
    });
  });

  describe("minutesToMs", () => {
    it("should convert minutes to ms", () => {
      expect(minutesToMs(10)).to.equal(600000);
      expect(minutesToMs(0.0001)).to.equal(6);
    });
  });

  describe("secondsToMs", () => {
    it("should convert seconds to ms", () => {
      expect(secondsToMs(10)).to.equal(10000);
      expect(secondsToMs(0.001)).to.equal(1);
    });
  });
});
