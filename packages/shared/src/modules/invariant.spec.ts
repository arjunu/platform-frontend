import { expect } from "chai";

import { invariant, InvariantError } from "./invariant";

describe("invariant", () => {
  it("should throw on falsy value", () => {
    expect(() => invariant(false, "description")).to.throw(InvariantError);
    expect(() => invariant(0, "description")).to.throw(InvariantError);
    expect(() => invariant("", "description")).to.throw(InvariantError);
  });

  it("should pass on truthy value", () => {
    invariant(true, "description");
    invariant(1, "description");
  });
});
