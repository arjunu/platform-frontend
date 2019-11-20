import { expect } from "chai";
import { delay } from "redux-saga";

import { setupFakeClock } from "../../test/integrationTestUtils.unsafe";
import { isPromise, promiseTimeout, promisify } from "./PromiseUtils";

describe("promisify", () => {
  const fn = (a: number, b: number, cb: Function) => {
    if (a + b !== 3) {
      cb(new Error("error!"));
    }
    return cb(null, a + b);
  };

  it("resolves promise correctly with null as an error", () => {
    expect(promisify(fn)(1, 2)).to.be.fulfilled;
  });

  it("resolves promise correctly with undefined as an error", () => {
    const callback = (cb: Function) => cb(undefined, 10);

    expect(promisify(callback)()).to.be.fulfilled;
  });

  it("rejects promise if there's an error", () => {
    expect(promisify(fn)(1, 3)).to.be.rejected;
  });

  it("passing context works", async () => {
    const anotherFn = function(this: { a: number }, b: number, cb: Function): void {
      if (this.a + b !== 3) {
        cb(new Error("error!"));
      }
      return cb(null, this.a + b);
    };

    const context = {
      a: 2,
    };

    expect(await promisify(anotherFn.bind(context))(1)).to.eq(3);
  });

  it("double promisify does no harm", async () => {
    expect(await promisify(promisify(fn))(1, 2)).to.eq(3);
  });
});

describe("promiseTimeout", () => {
  const clock = setupFakeClock();

  it("should return promise value if resolved within time frame", async () => {
    const expectedReturnValue = 2;
    const fastPromise = async () => {
      await delay(500);
      return expectedReturnValue;
    };

    const actualReturnValuePromise = promiseTimeout({
      promise: fastPromise(),
      defaultValue: 5,
      timeout: 1000,
    });

    clock.fakeClock.tick(500);
    const actualReturnValue = await actualReturnValuePromise;
    // this shouldn't do anything
    clock.fakeClock.tick(500);

    expect(actualReturnValue).to.be.eq(expectedReturnValue);
  });

  it("should return default value on timeout", async () => {
    const expectedReturnValue = 2;
    const fastPromise = async () => {
      await delay(1000);
      return 42;
    };

    const actualReturnValuePromise = promiseTimeout({
      promise: fastPromise(),
      defaultValue: expectedReturnValue,
      timeout: 500,
    });

    clock.fakeClock.tick(500);
    const actualReturnValue = await actualReturnValuePromise;
    // this shouldn't do anything
    clock.fakeClock.tick(500);

    expect(actualReturnValue).to.be.eq(expectedReturnValue);
  });
});

describe("isPromise", () => {
  it("should detect native promises", () => {
    expect(isPromise(Promise.resolve("test"))).to.be.true;
  });

  it("should detect not promises", () => {
    expect(isPromise(5)).to.be.false;
  });
});
