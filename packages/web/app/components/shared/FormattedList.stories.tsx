import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EDelimiter, FormattedList } from "./FormattedList";

storiesOf("Atoms|FormattedList", module)
  .add("default (comma)", () => <FormattedList items={[<span>one</span>, "two", "three"]} />)
  .add("OR as last delimiter ", () => (
    <FormattedList items={["one", "two", "three"]} lastDelimiter={EDelimiter.OR} />
  ))
  .add("AND as last delimiter ", () => (
    <FormattedList items={["one", "two", "three"]} lastDelimiter={EDelimiter.AND} />
  ))
  .add("with - as delimiter ", () => (
    <FormattedList items={["one", "two", "three"]} delimiter=" - " />
  ));
