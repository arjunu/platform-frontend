import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../utils/storybookHelpers.unsafe";
import { DocumentConfidentialityAgreementModalLayout } from "./DocumentConfidentialityAgreementModal";

const data = {
  closeModal: action("closeModal"),
  confirm: action("confirm"),
  documentTitle: "Investment and Shareholder Agreement",
  companyName: "Fifth Force GmbH",
};

storiesOf("DocumentConfidentialityAgreementLayout", module)
  .addDecorator(withModalBody())
  .add("default", () => <DocumentConfidentialityAgreementModalLayout {...data} />);
