import { expect } from "chai";

import { objectToFilteredArray } from "./objectToFilteredArray";

describe("objectToFilteredArray", () => {
  const data1 = { id: "1", stuff: "some data" };
  const data2 = { id: "2", stuff: "some stuff we don't need" };
  const data3 = { id: "3", stuff: "some other data" };

  it("takes the values that satisfy the predicate from an object and puts it in array", () => {
    const obj = {
      key1: data1,
      key2: data2,
      key3: data3,
    };
    const filterFn = (key: string) => key !== "key2";

    const expectedOutput = [data1, data3];

    expect(objectToFilteredArray(filterFn, obj)).to.deep.eq(expectedOutput);
  });

  it("array", () => {
    const arr: any[] = [data1, data2, data3];

    const filterFn = (key: string) => key !== "1";

    const expectedOutput = [data1, data3];

    expect(objectToFilteredArray(filterFn, arr as any)).to.deep.eq(expectedOutput);
  });

  it("empty object", () => {
    const obj = {};
    const filterFn = (key: string) => key !== "key2";

    expect(objectToFilteredArray(filterFn, obj)).to.deep.eq([]);
  });

  it("empty array", () => {
    const obj: [] = [];
    const filterFn = (key: string) => key !== "key2";

    expect(objectToFilteredArray(filterFn, obj as any)).to.deep.eq([]);
  });

  it("undefined", () => {
    const obj = undefined;
    const filterFn = (key: string) => key !== "key2";

    expect(() => objectToFilteredArray(filterFn, obj as any)).to.throw;
  });

  it("null", () => {
    const obj = null;
    const filterFn = (key: string) => key !== "key2";

    expect(() => objectToFilteredArray(filterFn, obj as any)).to.throw;
  });

  it("string", () => {
    const obj = "string";
    const filterFn = (key: string) => key !== "key2";

    expect(() => objectToFilteredArray(filterFn, obj as any)).to.throw;
  });

  it("number", () => {
    const obj = 22;
    const filterFn = (key: string) => key !== "key2";

    expect(() => objectToFilteredArray(filterFn, obj as any)).to.throw;
  });
});
