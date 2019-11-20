import { storiesOf } from "@storybook/react";
import * as React from "react";
import { Container } from "reactstrap";

import { testCompany, testContract, testEto } from "../../../../test/fixtures";
import { withStore } from "../../../utils/storeDecorator.unsafe";
import { EtoView } from "./EtoView";

const testStore = {
  eto: {
    etos: {
      "deabb8a4-d081-4d15-87a7-737a09e6a87c": testEto,
    },
    contracts: {
      "deabb8a4-d081-4d15-87a7-737a09e6a87c": testContract,
    },
    companies: {
      "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0": testCompany,
    },
  },
};

storiesOf("ETO/EtoView", module)
  .addDecorator(withStore(testStore))
  .add("investor view", () => (
    <Container>
      <EtoView eto={testEto} publicView={true} isUserFullyVerified={true} />
    </Container>
  ))
  .add("issuer view", () => (
    <Container>
      <EtoView eto={testEto} publicView={false} isUserFullyVerified={true} />
    </Container>
  ));
