const POLLING_TIME = 500;
const TIME_THRESHOLD = 100;

export enum EDelayTiming {
  EXACT,
  DELAYED,
}

type TSafeSetTimeoutOptions = { threshold: number };

let lastActiveTimerId = 0;
let activeTimers: number[] = [];

const safeSetTimeoutRec = (
  fn: (d: EDelayTiming) => void,
  endTime: number,
  timerId: number,
  options: TSafeSetTimeoutOptions,
) => {
  const msToEnd = endTime - Date.now();

  setTimeout(
    () => {
      if (!activeTimers.includes(timerId)) {
        return;
      }

      const now = Date.now();

      if (now >= endTime) {
        fn(now - endTime <= options.threshold ? EDelayTiming.EXACT : EDelayTiming.DELAYED);
      } else {
        safeSetTimeoutRec(fn, endTime, timerId, options);
      }
    },
    msToEnd <= POLLING_TIME ? msToEnd : POLLING_TIME,
  );
};

/**
 * Safe version of `setTimeout` that should support
 * 1. Large milliseconds delays (larger than 2147483647)
 * 2. Hibernation/Sleep
 *
 * @param fn callback to be invoked after
 * @param ms milliseconds to wait
 * @param options timer options
 *
 * Note: `safeSetTimeout` should be only used when really needed
 *        as processor overhead is bigger than with normal `setTimeout`
 * @returns timerId Use `clearSafeTimeout(timerId)` to cancel timeout
 */
export const safeSetTimeout = (
  fn: (d: EDelayTiming) => void,
  ms: number,
  options: TSafeSetTimeoutOptions = { threshold: TIME_THRESHOLD },
): number => {
  const timerId = ++lastActiveTimerId;

  activeTimers.push(timerId);

  safeSetTimeoutRec(fn, Date.now() + ms, timerId, options);

  return timerId;
};

/**
 * Cancel timeout created with `safeSetTimeout`.
 */
export const clearSafeTimeout = (timerId: number): void => {
  activeTimers = activeTimers.filter(id => id !== timerId);
};

/**
 * Promise wrapper around `safeSetTimeout`.
 */
export function safeDelay(ms: number, options?: TSafeSetTimeoutOptions): Promise<EDelayTiming> {
  return new Promise(resolve => {
    safeSetTimeout(resolve, ms, options);
  });
}

/*
 * Simple Promise wrapper around `setTimeout`.
 * Be careful with longer timeouts as this one doesn't consider
 * sleep/hibernation. Prefer `safeTimeout` for delays longer 1 minute
 */
export const simpleDelay = (ms: number) => new Promise(res => setTimeout(res, ms));
