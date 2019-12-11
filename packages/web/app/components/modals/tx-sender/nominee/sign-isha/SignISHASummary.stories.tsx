import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EProcessState } from "../../../../../utils/enums/processStates";
import { withModalBody } from "../../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { SignNomineeISHASummaryLayout } from "./SignISHASummary";

storiesOf("NomineeSignISHA/Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <SignNomineeISHASummaryLayout
      onAccept={action("onAccept")}
      previewCode={"123"}
      uploadState={EProcessState.SUCCESS}
      uploadedFileName={"test_file_name"}
      startDocumentRemove={action("startDocumentRemove")}
      onDropFile={action("onDropFile")}
    />
  ));
