import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { VerificationMethod } from "./VerificationMethod";

import onfido from "../../../assets/img/instant-id/onfido.svg";

storiesOf("molecules|KYC/VerificationMethod", module)
  .add("default", () => (
    <VerificationMethod
      name={"onfido"}
      logo={onfido}
      onClick={action("START_ONFIDO")}
      errorText={undefined}
      infoText={undefined}
      text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem corporis debitis ea eligendi expedita temporibus?"
    />
  ))
  .add("with error message", () => (
    <VerificationMethod
      name={"onfido"}
      logo={onfido}
      onClick={action("START_ONFIDO")}
      errorText={"Not supported browser"}
      infoText={undefined}
      text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem corporis debitis ea eligendi expedita temporibus?"
    />
  ))
  .add("with info message", () => (
    <VerificationMethod
      name={"onfido"}
      logo={onfido}
      onClick={action("START_ONFIDO")}
      errorText={undefined}
      infoText={"Lorem ipsum dolor sit amet"}
      text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem corporis debitis ea eligendi expedita temporibus?"
    />
  ));
