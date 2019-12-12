import { expect } from "chai";
import { spy } from "sinon";

import { setupFakeClock } from "../../test/integrationTestUtils.unsafe";
import { noopLogger } from "../lib/dependencies/logger";
import { AsyncIntervalScheduler } from "./AsyncIntervalScheduler";
import { safeDelay } from "./safeTimers";

describe("AsyncIntervalScheduler", () => {
  const expectedInterval = 500;
  const clock = setupFakeClock();

  it("should wait for async callback execution to finish", async () => {
    const expectedFunctionDelay = 2000;
    const asyncFunctionMock = spy(() => safeDelay(expectedFunctionDelay));
    const asyncInterval = new AsyncIntervalScheduler(
      noopLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    clock.fakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;

    // no more calls because async task takes time
    await clock.fakeClock.tickAsync(expectedFunctionDelay);
    expect(asyncFunctionMock).to.be.calledOnce;

    clock.fakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledTwice;
  });

  it("should not call callback before interval time passes", () => {
    const asyncFunctionMock = spy(async () => {});

    const asyncInterval = new AsyncIntervalScheduler(
      noopLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    expect(asyncFunctionMock).to.be.not.calledOnce;
  });

  it("should allow to stop", () => {
    const asyncFunctionMock = spy(async () => {});

    const asyncInterval = new AsyncIntervalScheduler(
      noopLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    clock.fakeClock.tick(expectedInterval - 1);
    asyncInterval.stop();
    clock.fakeClock.tick(1);
    expect(asyncFunctionMock).to.be.not.calledOnce;
  });

  it("should allow to stop during callback execution", async () => {
    const expectedFunctionDelay = 2000;
    const asyncFunctionMock = spy(() => safeDelay(expectedFunctionDelay));

    const asyncInterval = new AsyncIntervalScheduler(
      noopLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    clock.fakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;
    asyncInterval.stop();

    // wait for function execution to finish
    await clock.fakeClock.tickAsync(expectedFunctionDelay);

    clock.fakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;
  });

  it("should do nothing when starting already started instance", () => {
    const expectedFunctionDelay = 2000;
    const asyncFunctionMock = spy(() => safeDelay(expectedFunctionDelay));
    const asyncInterval = new AsyncIntervalScheduler(
      noopLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    clock.fakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;

    asyncInterval.start();

    clock.fakeClock.tick(expectedInterval);
    expect(asyncFunctionMock).to.be.calledOnce;
  });

  it("should do nothing when stopped second time", () => {
    const asyncFunctionMock = spy(async () => {});

    const asyncInterval = new AsyncIntervalScheduler(
      noopLogger,
      asyncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    clock.fakeClock.tick(expectedInterval - 1);
    asyncInterval.stop();
    clock.fakeClock.tick(1);
    expect(asyncFunctionMock).to.be.not.calledOnce;

    clock.fakeClock.tick(expectedInterval - 1);
    asyncInterval.stop();
    clock.fakeClock.tick(1);
    expect(asyncFunctionMock).to.be.not.calledOnce;
  });

  it("should work with sync functions", () => {
    const syncFunctionMock = spy(() => {});
    const asyncInterval = new AsyncIntervalScheduler(
      noopLogger,
      syncFunctionMock,
      expectedInterval,
    );
    asyncInterval.start();

    clock.fakeClock.tick(expectedInterval);
    expect(syncFunctionMock).to.be.calledOnce;

    clock.fakeClock.tick(expectedInterval);
    expect(syncFunctionMock).to.be.calledTwice;
  });
});
