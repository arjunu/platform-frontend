import { storiesOf } from "@storybook/react";
import React from "react";

import { Dropzone } from "./Dropzone";

storiesOf("Dropzone", module)
  .add("default", () => <Dropzone name="dropzone" />)
  .add("uploading", () => <Dropzone name="dropzone" isUploading={true} />)
  .add("disabled", () => <Dropzone name="dropzone" disabled={true} />);
