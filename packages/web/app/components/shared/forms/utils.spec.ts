import { expect } from "chai";
import * as Yup from "yup";

import {
  addValidator,
  convertAndValidatePipeline,
  deleteValidator,
  ObjectSchema,
  replaceValidatorWith,
  transformValidator,
} from "./utils";

describe("convertAndValidatePipeline", () => {
  it("it converts the data and runs validations step by step according to conversion/validation spec", async () => {
    const data = { value: "25.7" };

    const spec = [
      {
        validator: Yup.object().shape({ value: Yup.number() }),
        conversionFn: (x: { value: string }) => ({ value: parseFloat(x.value) }),
      },
      {
        validator: Yup.object().shape({ value: Yup.string() }),
        conversionFn: (x: { value: string }) => ({ value: `252525${x}` }),
      },
    ];

    expect(convertAndValidatePipeline(spec)(data)).to.eq(undefined); /* e.g. no errors */
  });

  it("it runs all specs and returns errors as formik errors object", () => {
    const data = {
      value1: "yyy",
      value2: "yyy",
      value3: "35",
    };
    const validator = Yup.object().shape({
      value1: Yup.string(),
      value2: Yup.number().typeError("this is not a number!"),
      value3: Yup.number().typeError("this is not a number!"),
    });

    const spec = [
      {
        /* this converts data to a valid form */
        validator,
        conversionFn: (_: { value3: string; value2: string }) => ({
          value2: 2,
          value3: 3,
        }),
      },
      {
        /* this spec generates errors. value2 is invalid */
        validator,
        conversionFn: (x: { value3: string; value2: string }) => ({
          value2: parseFloat(x.value2),
          value3: parseFloat(x.value3),
        }),
      },
    ];

    expect(convertAndValidatePipeline(spec)(data)).to.deep.eq({
      value2: "this is not a number!",
    });
  });

  it("it returns errors for the invalid specs as formik errors object", () => {
    const data = {
      value1: "yyy",
      value2: "yyy",
      value3: "35",
    };
    const validator0 = Yup.object().shape({
      value1: Yup.string(),
      value2: Yup.number().typeError("I am the first validator. This is not a number!"),
      value3: Yup.number().typeError("I am the first validator. This is not a number!"),
    });

    const validator2 = Yup.object().shape({
      value1: Yup.string(),
      value2: Yup.number().typeError("I am the second validator. This is not a number!"),
      value3: Yup.string().typeError("I am the second validator. This is not a string!"),
    });

    const spec = [
      {
        /* this spec generates errors. value2 is invalid */
        validator: validator0,
        conversionFn: (x: { value3: string; value2: string }) => ({
          value2: parseFloat(x.value2),
          value3: parseFloat(x.value3),
        }),
      },
      {
        /* this converts data to a valid form */
        validator: validator0,
        conversionFn: (_: { value3: string; value2: string }) => ({
          value2: 2,
          value3: 3,
        }),
      },
      {
        /* this is not valid either. value2 and value3 is invalid. */
        /*Only value3 will be reported in this spec because value2 was invalid in the previous spec */
        validator: validator2,
        conversionFn: (x: { value3: string; value2: string }) => ({
          value2: `252525${x.value2}`,
          value3: parseInt(`252525${x.value3}`, 10),
        }),
      },
    ];

    expect(convertAndValidatePipeline(spec)(data)).to.deep.eq({
      value2: "I am the first validator. This is not a number!",
      value3: "I am the second validator. This is not a string!",
    });
  });
});

describe("transformValidator", () => {
  it("updates the given validator according to transformation spec", () => {
    const baseValidator = Yup.object().shape({
      useOfCapital: Yup.string().required(),
      useOfCapitalList: Yup.array().of(Yup.boolean()),
      customerGroup: Yup.string().meta({ isWysiwyg: true }),
      sellingProposition: Yup.boolean(),
      marketingApproach: Yup.number(),
    });

    const transformationSpec = {
      useOfCapitalList: replaceValidatorWith(Yup.number()),
      marketingApproach: deleteValidator(),
      companyMission: addValidator(Yup.string()),
    };

    const expectedResult = Yup.object().shape({
      useOfCapital: Yup.string().required(),
      useOfCapitalList: Yup.number(),
      customerGroup: Yup.string().meta({ isWysiwyg: true }),
      sellingProposition: Yup.boolean(),
      companyMission: Yup.string(),
    }) as ObjectSchema<any>;

    const result = transformValidator(transformationSpec)(baseValidator as ObjectSchema<
      any
    >) as ObjectSchema<any>;

    expect(Object.keys(result.fields)).to.deep.eq(Object.keys(expectedResult.fields));
    expect(result.fields["useOfCapitalList"]).to.be.instanceOf(Yup.number);
    expect(result.fields["companyMission"]).to.be.instanceOf(Yup.string);
    expect(result.fields).to.not.have.property("marketingApproach");
  });

  it("throws an error if schema supplied to transformValidator is not an object schema", () => {
    const schema = Yup.string();
    const transformationSpec = {};

    expect(() => transformValidator(transformationSpec)(schema as any)).to.throw;
  });
});
