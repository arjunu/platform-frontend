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

export function isPromise<T = any>(value: any): value is Promise<T> {
  return !!(value && value.then && value.catch);
}
