import { expect } from "chai";
import { mount } from "enzyme";
import { noop } from "lodash";
import * as React from "react";
import { SinonStub, stub } from "sinon";
import { object, string } from "yup";

import { noopLogger } from "../../../lib/dependencies/logger/index";
import * as hooks from "../hooks/useLogger";
import { Form } from "./Form";

describe("<Form />", () => {
  it("should warn when more values than required by schema were passed as `initialValues`", () => {
    const initialEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const stubbedLogger = stub(noopLogger);

    stub(hooks, "useLogger").returns(stubbedLogger);

    const schema = object({
      foo: string(),
    });

    const component = mount(
      <Form validationSchema={schema} onSubmit={noop} initialValues={{ foo: "baz", bar: "qux" }} />,
    );

    expect(stubbedLogger.warn).to.have.been.called;

    // unmount to get rid of post mount formik validation
    component.unmount();

    process.env.NODE_ENV = initialEnv;
    (hooks.useLogger as SinonStub).restore();
  });
});
