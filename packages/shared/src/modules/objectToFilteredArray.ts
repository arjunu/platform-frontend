export const objectToFilteredArray = <T>(
  predicate: (key: string) => boolean,
  obj: Record<string, T>,
) =>
  Object.keys(obj).reduce<T[]>((acc, key) => {
    if (predicate(key)) {
      acc.push(obj[key]);
    }
    return acc;
  }, []);
