import { expect } from "chai";

import { updateArrayItem } from "./utils";

describe("KYC reducer", () => {
  describe("updateArrayItem", () => {
    it("should update item on given position", () => {
      const input = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];

      const actualArray = updateArrayItem(input, "3", { id: "NEW" });

      expect(actualArray).to.be.deep.eq([
        { id: "1" },
        { id: "2" },
        { id: "NEW" },
        { id: "4" },
        { id: "5" },
      ]);
    });

    it("should append item when searched item doesnt exist", () => {
      const input = [{ id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" }];

      const actualArray = updateArrayItem(input, "NEW", { id: "NEW" });

      expect(actualArray).to.be.deep.eq([
        { id: "1" },
        { id: "2" },
        { id: "3" },
        { id: "4" },
        { id: "5" },
        { id: "NEW" },
      ]);
    });
  });
});
