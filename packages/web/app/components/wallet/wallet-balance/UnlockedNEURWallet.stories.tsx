import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Q18 } from "../../../config/constants";
import { UnlockedNEURWallet } from "./UnlockedNEURWallet";

storiesOf("Unlocked EUR Wallet", module)
  .add("empty and disabled", () => (
    <UnlockedNEURWallet
      onPurchase={action("onPurchase")}
      onRedeem={action("redeem")}
      onVerify={action("onVerify")}
      neuroAmount={"0"}
      neuroEuroAmount={"0"}
      isUserFullyVerified={false}
    />
  ))
  .add("not empty and enabled", () => (
    <UnlockedNEURWallet
      onPurchase={action("onPurchase")}
      onRedeem={action("redeem")}
      onVerify={action("onVerify")}
      neuroAmount={Q18.mul("847213").toString()}
      neuroEuroAmount={Q18.mul("847213").toString()}
      isUserFullyVerified={true}
    />
  ));
