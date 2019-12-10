import { expect } from "chai";

import { toCamelCase, toSnakeCase } from "./transformObjectKeys";

describe("transform object keys", () => {
  it("should transform shallow object to camel case and back", () => {
    const snakeCase = {
      value_one: true,
      value_two: "string",
    };

    const camelCase = {
      valueOne: true,
      valueTwo: "string",
    };

    expect(toCamelCase(snakeCase)).to.deep.equal(camelCase);
    expect(toSnakeCase(camelCase)).to.deep.equal(snakeCase);
  });

  it("should transform array to camel case and back", () => {
    const snakeCase = [
      {
        value_one: true,
        value_two: "string",
      },
      {
        value_three: true,
        value_four: "string",
      },
    ];

    const camelCase = [
      {
        valueOne: true,
        valueTwo: "string",
      },
      {
        valueThree: true,
        valueFour: "string",
      },
    ];

    expect(toCamelCase(snakeCase)).to.deep.equal(camelCase);
    expect(toSnakeCase(camelCase)).to.deep.equal(snakeCase);
  });

  it("should transform a monster nested object to camel case and back", () => {
    const snakeCase = {
      value_one: true,
      value_two: "string",
      nested_object: {
        value_three: 123123,
        value_four: undefined,
        depper_nested_object: {
          value_eight: "eight",
        },
      },
      nested_array: [
        "one",
        "two",
        {
          value_five: "hallo",
          subarray: [
            {
              value_fifteen: "hello",
              value_sixteen: undefined,
            },
          ],
        },
      ],
    };

    const camelCase = {
      valueOne: true,
      valueTwo: "string",
      nestedObject: {
        valueThree: 123123,
        valueFour: undefined,
        depperNestedObject: {
          valueEight: "eight",
        },
      },
      nestedArray: [
        "one",
        "two",
        {
          valueFive: "hallo",
          subarray: [
            {
              valueFifteen: "hello",
              valueSixteen: undefined,
            },
          ],
        },
      ],
    };

    expect(toCamelCase(snakeCase)).to.deep.equal(camelCase);
    expect(toSnakeCase(camelCase)).to.deep.equal(snakeCase);
  });

  it("should handle primitives and udefined gracefully", () => {
    expect(toCamelCase(undefined)).to.equal(undefined);
    expect(toCamelCase(123123)).to.equal(123123);
    expect(toCamelCase("hallo_blah")).to.equal("hallo_blah");
  });
});
