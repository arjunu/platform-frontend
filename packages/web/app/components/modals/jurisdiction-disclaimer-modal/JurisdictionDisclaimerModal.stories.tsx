import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ECountries } from "../../../utils/enums/countriesEnum";
import { withModalBody } from "../../../utils/storybookHelpers.unsafe";
import { JurisdicitonDisclaimerModalLayout } from "./JurisdictionDisclaimerModal";

storiesOf("ETO/PublicView/JurisdictionDisclaimerModal", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <JurisdicitonDisclaimerModalLayout
      restrictedJurisdiction={ECountries.LIECHTENSTEIN}
      confirm={action("confirm")}
      closeModal={action("closeModal")}
    />
  ));
