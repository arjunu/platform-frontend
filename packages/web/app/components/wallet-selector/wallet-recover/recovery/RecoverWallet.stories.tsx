import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EWalletType } from "../../../../modules/web3/types";
import { withStore } from "../../../../utils/react-connected-components/storeDecorator.unsafe";
import { RecoverWallet, RecoveryProcessesComponent } from "./RecoverWallet";

storiesOf("RecoveryProcesses", module)
  .addDecorator(
    withStore({
      walletSelector: { isMessageSigning: false },
      web3: {
        connected: true,
        wallet: {
          walletType: EWalletType.LIGHT,
        },
      },
    }),
  )
  .add("Enter Seed", () => <RecoveryProcessesComponent submitForm={action("recover")} />)
  .add("Enter Email and Password", () => (
    <RecoveryProcessesComponent submitForm={action("recover")} seed="HEHE IAMA SEED PHRASE" />
  ));

storiesOf("RecoveryProcesses Message Signing", module)
  .addDecorator(
    withStore({
      walletSelector: { isMessageSigning: true },
      web3: {
        connected: true,
        wallet: {
          walletType: EWalletType.LIGHT,
        },
      },
    }),
  )
  .add("Message Signing", () => <RecoverWallet />);
