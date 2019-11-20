import { expect } from "chai";
import { spy } from "sinon";

import { Storage } from "./Storage";

describe("Browser Storage", () => {
  const expectedPhrase = "dummyWallet";
  const key = "lightWallet";
  // Due to all tests being async every test has its own localStorageMock

  describe("native local storage", () => {
    it("should store an item", async () => {
      const localStorageMock: any = {
        setItem: spy(),
        getItem: spy(() => expectedPhrase),
        removeItem: spy(),
      };
      const storage = new Storage(localStorageMock);

      storage.setKey(key, expectedPhrase);

      expect(localStorageMock.setItem).to.be.calledWithExactly(key, expectedPhrase);
    });

    it("should retrieve an item given a key", async () => {
      const localStorageMock: any = {
        setItem: spy(),
        getItem: spy(() => expectedPhrase),
        removeItem: spy(),
      };
      const storage = new Storage(localStorageMock);

      storage.getKey(key);

      expect(localStorageMock.getItem).to.be.calledOnce;
    });

    it("should clear given key", async () => {
      const localStorageMock: any = {
        setItem: spy(),
        getItem: spy(() => expectedPhrase),
        removeItem: spy(),
      };
      const storage = new Storage(localStorageMock);

      storage.removeKey(key);

      expect(localStorageMock.removeItem).to.be.calledTwice;
      expect(localStorageMock.removeItem).to.be.calledWithExactly(key);
    });
  });

  describe("memory local storage", () => {
    it("should store an item in memory local storage", async () => {
      const storage = new Storage(null as any);

      storage.setKey(key, expectedPhrase);
      const returnedPhrase = storage.getKey(key);

      expect(returnedPhrase).to.be.equal(expectedPhrase);
    });

    it("should return false when checkIsSupported is called", async () => {
      const storage = new Storage(null as any);

      expect(storage.checkIsSupported()).to.be.equal(false);
    });

    it("should return true when checkIsSupported is called", async () => {
      const localStorageMock: any = {
        setItem: spy(),
        getItem: spy(() => expectedPhrase),
        removeItem: spy(),
      };
      const storage = new Storage(localStorageMock);

      expect(storage.checkIsSupported()).to.be.equal(true);
    });
  });
});
