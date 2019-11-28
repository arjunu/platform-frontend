import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "../../../shared/forms/fields/testingUtils.unsafe";
import { EtoTagWidget, generateTagOptions } from "./EtoTagWidget.unsafe";

const tagList = ["Science", "Technology", "Blockchain", "Medical", "Research"];

storiesOf("TagsFormWidget", module)
  .add(
    "Empty",
    formWrapper({ tags: [] })(() => (
      <EtoTagWidget selectedTagsLimit={5} options={generateTagOptions(tagList)} name="tags" />
    )),
  )
  .add(
    "Already Tags",
    formWrapper({ tags: ["Fintech", "Black Magic"] })(() => (
      <EtoTagWidget selectedTagsLimit={5} options={generateTagOptions(tagList)} name="tags" />
    )),
  );
