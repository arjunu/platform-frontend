import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Input } from "./index";

storiesOf("Core|molecules/Input", module)
  .add("default", () => <Input label="Form field" name="value" />)
  .add("with suffix", () => <Input label="Form field" name="value" suffix="%" />)
  .add("with prefix", () => <Input label="Form field" name="value" prefix="@" />)
  .add("with error message", () => {
    const [value, changeValue] = React.useState("");

    return (
      <Input
        label="Form field"
        name="value"
        errorMsg="something is wrong"
        prefix="per unit"
        suffix="€"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          changeValue(e.target.value);
        }}
      />
    );
  });
