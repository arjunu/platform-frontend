import { expect } from "chai";

import { withParams } from "./withParams";

describe("withParams", () => {
  it("replace params with correct value", () => {
    const paramName = "etoId";
    const route = `eto-listing/:${paramName}`;
    const paramValue = "eto-id";

    const url = withParams(route, { [paramName]: paramValue });

    expect(url).to.eq("eto-listing/eto-id");
  });

  it("throws when there is no match", () => {
    const paramName = "etoId";
    const route = `eto-listing/:${paramName}`;

    expect(() => withParams(route, {})).to.throw(
      `There is no match for ${paramName} in route ${route}`,
    );
  });
});
