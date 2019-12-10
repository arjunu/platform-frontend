import { camelCase, mapKeys, mapValues, snakeCase } from "lodash";

type StringMapper = (s: string) => string;

const transformKeys = (mapper: StringMapper, object: any): any => {
  if (!object) {
    return object;
  }
  if (Array.isArray(object)) {
    return object.map(item => transformKeys(mapper, item));
  }
  if (typeof object === "object") {
    const result = mapKeys(object, (_value, key: string) => mapper(key));
    return mapValues(result, val => transformKeys(mapper, val));
  }
  return object;
};

export const toCamelCase = (object: any) => transformKeys(camelCase, object);

export const toSnakeCase = (object: any) => transformKeys(snakeCase, object);
