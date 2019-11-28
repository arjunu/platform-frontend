import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { withModalBody } from "../../../utils/storybookHelpers.unsafe";
import { EtoFileIpfsModalComponent } from "./EtoFileIpfsModal";

const data = {
  isOpen: true,
  onContinue: () => {},
  onDismiss: () => {},
};

storiesOf("ETO/FileIPFSModal", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <Container>
      <EtoFileIpfsModalComponent {...data} />
    </Container>
  ));
