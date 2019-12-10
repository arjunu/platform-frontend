import { nonNullable } from "@neufund/shared"
import { expect } from "chai";

import { AssertEqual, assertType } from "../../test/testUtils";

describe("nonNullable", () => {
  it("should exclude null and undefined from `value` type definition", () => {
    const value: string | undefined | null = "foo" as string | null | undefined;

    // tslint:disable-next-line:no-dead-store
    const result = nonNullable(value);

    assertType<AssertEqual<typeof result, string>>(true);
  });

  it("should throw when null or undefined was passed as a `value`", () => {
    expect(() => nonNullable(undefined)).to.throw(Error);
    expect(() => nonNullable(null)).to.throw(Error);
  });
});
