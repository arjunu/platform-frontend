import { expect } from "chai";

import { derivationPathPrefixValidator } from "./Validators";

const DEFAULT_DERIVATION_PATH_PREFIX = "44'/60'/0'/";

describe("Validators", () => {
  describe("derivationPathPrefixValidator", () => {
    const correctPrefix = DEFAULT_DERIVATION_PATH_PREFIX;
    const incorrectPrefix = [
      "44'/60'/0'/2/",
      "44'/62'/0'/0",
      "44'/60'/0'/0a",
      "a44'/60'/0'/0",
      "44'/60'/0'/0'/s",
    ];

    it("should return null for correct prefix path", () => {
      expect(derivationPathPrefixValidator(correctPrefix)).to.be.null;
    });

    it("should return string message for incorrect prefix path", () => {
      for (const dp of incorrectPrefix) {
        const validationResult = derivationPathPrefixValidator(dp);
        expect(validationResult).to.be.not.null;
        expect(validationResult).to.be.a("string");
        expect(validationResult!.length).to.be.greaterThan(0);
      }
    });
  });
});
