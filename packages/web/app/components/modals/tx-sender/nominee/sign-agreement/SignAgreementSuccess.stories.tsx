import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ETxSenderType } from "../../../../../modules/tx/types";
import { withModalBody } from "../../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { SignNomineeAgreementSuccessLayout } from "./SignAgreementSuccess";

storiesOf("NomineeAgreements/Success", module)
  .addDecorator(withModalBody())
  .add("THA", () => (
    <SignNomineeAgreementSuccessLayout
      txType={ETxSenderType.NOMINEE_THA_SIGN}
      onClose={action("CLOSE")}
    />
  ))
  .add("RAAA", () => (
    <SignNomineeAgreementSuccessLayout
      txType={ETxSenderType.NOMINEE_RAAA_SIGN}
      onClose={action("CLOSE")}
    />
  ));
