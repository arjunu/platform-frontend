import * as lolex from "lolex";

export const setupFakeClock = (options?: lolex.LolexInstallOpts) => {
  let wrapper: {
    fakeClock: lolex.Clock;
  } = {
    fakeClock: ({
      tick: () => {
        throw new Error("Clock needs to be initialized before use");
      },
      setSystemTime: () => {
        throw new Error("Clock needs to be initialized before use");
      },
    } as unknown) as lolex.Clock,
  };
  beforeEach(() => {
    // note: we use custom fork of lolex providing tickAsync function which should be used to await for any async actions triggered by tick. Read more: https://github.com/sinonjs/lolex/pull/105
    // TODO: check why typings are not accurate here
    wrapper.fakeClock = lolex.install(options);
  });
  afterEach(() => {
    if (wrapper.fakeClock) {
      wrapper.fakeClock.uninstall();
    }
  });
  return wrapper;
};
