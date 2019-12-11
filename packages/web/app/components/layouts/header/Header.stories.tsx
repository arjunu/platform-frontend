import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EUserType } from "../../../lib/api/users/interfaces";
import { IAppState } from "../../../store";
import { DeepPartial } from "../../../types";
import { withStore } from "../../../utils/react-connected-components/storeDecorator.unsafe";
import { HeaderAuthorized, HeaderTransitional, HeaderUnauthorized } from "./Header";

const authStoreInvestor = {
  auth: {
    jwt: "asdf",
    user: {
      type: EUserType.INVESTOR,
      verifiedEmail: "asfasdf@asdf.de",
    },
  },
};

const authStoreIssuer = {
  auth: {
    jwt: "asdf",
    user: {
      type: EUserType.ISSUER,
      verifiedEmail: "asfasdf@asdf.de",
    },
  },
};

storiesOf("Layout/Header for investor", module)
  .addDecorator(withStore(authStoreInvestor as DeepPartial<IAppState>))
  .add("default", () => (
    <>
      <HeaderAuthorized />
    </>
  ));

storiesOf("Layout/Header for issuer", module)
  .addDecorator(withStore(authStoreIssuer as DeepPartial<IAppState>))
  .add("default", () => (
    <>
      <HeaderAuthorized />
    </>
  ));

storiesOf("Layout/Header unauthorized", module).add("default", () => (
  <>
    <HeaderUnauthorized />
  </>
));

storiesOf("Layout/Header transitional", module).add("default", () => (
  <>
    <HeaderTransitional />
  </>
));
