import { expect } from "chai";

import { createMock } from "../../../test/testUtils";
import { noopLogger } from "../dependencies/logger";
import { ObjectStorage } from "./ObjectStorage";
import { Storage } from "./Storage";

describe("Object storage", () => {
  it("should store value in storage", () => {
    const expectedKey = "SOME_KEY";
    const expectedValue = "somedummyjwt";
    const storageMock = createMock(Storage, {
      setKey: () => {},
    });

    const objectStorage = new ObjectStorage<string>(storageMock, noopLogger, expectedKey);
    objectStorage.set(expectedValue);

    expect(storageMock.setKey).to.be.calledWithExactly(expectedKey, JSON.stringify(expectedValue));
  });

  it("should get value from storage", () => {
    const expectedKey = "SOME_KEY";
    const expectedValue = '"somedummyjwt"';
    const storageMock = createMock(Storage, {
      getKey: () => expectedValue,
    });

    const objectStorage = new ObjectStorage<string>(storageMock, noopLogger, expectedKey);
    const actualValue = objectStorage.get();

    expect(actualValue).to.be.eq(JSON.parse(expectedValue));
  });

  it("should get non-existent key from storage", () => {
    const expectedKey = "SOME_KEY";
    const storageMock = createMock(Storage, {
      getKey: () => null,
    });

    const objectStorage = new ObjectStorage<string>(storageMock, noopLogger, expectedKey);
    const actualValue = objectStorage.get();

    expect(actualValue).to.be.undefined;
  });

  it("should clear key from storage", () => {
    const expectedKey = "SOME_KEY";
    const storageMock = createMock(Storage, {
      removeKey: () => undefined,
    });

    const objectStorage = new ObjectStorage<string>(storageMock, noopLogger, expectedKey);
    objectStorage.clear();

    expect(storageMock.removeKey).to.be.calledOnce;
    expect(storageMock.removeKey).to.be.calledWithExactly(expectedKey);
  });
});
