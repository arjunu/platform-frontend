import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { SubmitProposalWidgetComponent } from "./SubmitProposalWidget";

storiesOf("SubmitETOProposalWidget", module).add("default", () => (
  <SubmitProposalWidgetComponent submitProposal={action("submitProposal")} />
));
