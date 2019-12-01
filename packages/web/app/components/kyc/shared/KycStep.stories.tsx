import { storiesOf } from "@storybook/react";
import * as React from "react";

import { KycStep } from "./KycStep";

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid architecto dolorem earum hic laborum, maxime nulla possimus quisquam quos similique temporibus tenetur. Amet debitis doloremque ducimus, id ipsum iste minus?";

storiesOf("molecules|KYC/KycStep", module).add("default", () => (
  <KycStep step={1} allSteps={5} title="Kyc Step Title" description={lorem} />
));
