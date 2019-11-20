import { delay } from "redux-saga";

export const promisify = <T>(fn: Function) =>
  function(...args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      fn(...args, (err: any, result: T) => {
        if (err !== null && err !== undefined) {
          return reject(err);
        } else {
          return resolve(result);
        }
      });
    });
  };

interface IPromiseTimeoutConfig<T> {
  promise: Promise<T>;
  defaultValue: T;
  timeout: number;
}

/**
 * Wait for promise to resolve for specific time or return default value
 */
export function promiseTimeout<T>(options: IPromiseTimeoutConfig<T>): Promise<T> {
  return Promise.race([options.promise, delay(options.timeout, options.defaultValue)]);
}

export function isPromise<T = any>(value: any): value is Promise<T> {
  return !!(value && value.then && value.catch);
}
