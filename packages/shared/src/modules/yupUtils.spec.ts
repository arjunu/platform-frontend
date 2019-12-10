import { expect } from "chai";
import * as Yup from "yup";

import { AssertEqual, assertType } from "./test/testUtils";
import {
  findMax,
  findMin,
  getSchemaField,
  isRequired,
  makeAllRequired,
  pickSchemaValues,
} from "./yupUtils";

describe("yupUtils", () => {
  describe("isRequired", () => {
    it("should return true for required field", () => {
      const schema = Yup.object().shape({
        id: Yup.string().required(),
      });

      const idField = getSchemaField("id", schema);

      expect(isRequired(idField)).to.be.true;
    });

    it("should return false for optional field", () => {
      const schema = Yup.object().shape({
        name: Yup.string(),
      });

      const nameField = getSchemaField("name", schema);

      expect(isRequired(nameField)).to.be.false;
    });
  });

  describe("findMin", () => {
    it("finds yup.max() value", () => {
      const min = 1;
      const schema = Yup.number().min(min);

      expect(findMin(schema)).to.be.equal(min);
    });
  });

  describe("findMax", () => {
    it("finds yup.min() value", () => {
      const max = 20;
      const schema = Yup.number().max(max);

      expect(findMax(schema)).to.be.equal(max);
    });
  });

  describe("pickSchemaValues", () => {
    it("should pick only values defined by schema", () => {
      type expectedType = { foo: string };
      const result: expectedType = pickSchemaValues(Yup.object({ foo: Yup.string() }), {
        foo: "bar",
        baz: "quix",
      });

      assertType<AssertEqual<typeof result, expectedType>>(true);

      expect(result).to.be.keys("foo");
      expect(result).to.have.property("foo", "bar");
    });
  });

  describe("makeAllRequired", () => {
    it("should make schema fields required", () => {
      const requiredSchema = makeAllRequired(Yup.object({ foo: Yup.string(), bar: Yup.number() }));

      const fooSchema = getSchemaField("foo", requiredSchema);
      const barSchema = getSchemaField("bar", requiredSchema);

      expect(isRequired(fooSchema)).to.be.true;
      expect(isRequired(barSchema)).to.be.true;
    });
  });
});
