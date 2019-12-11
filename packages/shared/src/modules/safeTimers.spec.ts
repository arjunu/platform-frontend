import { expect } from "chai";
import { spy } from "sinon";

import { clearSafeTimeout, EDelayTiming, safeSetTimeout } from "./safeTimers";
import { setupFakeClock } from "./test/setupFakeClock";

describe("safeSetTimeout", () => {
  const clock = setupFakeClock();

  it("should return exact timing", () => {
    const callbackSpy = spy();

    safeSetTimeout(callbackSpy, 1300);

    clock.fakeClock.tick(1300);

    expect(callbackSpy).to.have.been.calledWith(EDelayTiming.EXACT);
  });

  it("should return delayed timing", () => {
    const callbackSpy = spy();

    safeSetTimeout(callbackSpy, 1000);

    // simulate hibernation
    clock.fakeClock.setSystemTime(1000);

    clock.fakeClock.tick(500);

    expect(callbackSpy).to.have.been.calledWith(EDelayTiming.DELAYED);
  });

  it("should return exact timing taking into account default threshold", () => {
    const callbackSpy = spy();

    safeSetTimeout(callbackSpy, 1900);

    // simulate hibernation
    clock.fakeClock.setSystemTime(1200);

    clock.fakeClock.tick(500);

    // simulate hibernation
    clock.fakeClock.setSystemTime(1800);

    clock.fakeClock.tick(200);

    expect(callbackSpy).to.have.been.calledWith(EDelayTiming.EXACT);
  });

  it("should return exact timing taking into account custom threshold", () => {
    const callbackSpy = spy();

    const threshold = 1000;

    safeSetTimeout(callbackSpy, 2000, { threshold });

    // simulate hibernation
    clock.fakeClock.setSystemTime(2500);

    clock.fakeClock.tick(threshold);

    expect(callbackSpy).to.have.been.calledWith(EDelayTiming.EXACT);
  });

  it("should correctly clear timeout", () => {
    const callbackSpy = spy();

    const timer = safeSetTimeout(callbackSpy, 1900);

    clearSafeTimeout(timer);

    // simulate hibernation
    clock.fakeClock.setSystemTime(1500);

    clock.fakeClock.tick(2000);

    expect(callbackSpy).to.not.have.been.called;
  });
});
