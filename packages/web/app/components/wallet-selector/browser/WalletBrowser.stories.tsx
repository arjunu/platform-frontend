import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BrowserWalletErrorMessage } from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { WalletBrowserComponent } from "./WalletBrowser";

storiesOf("Wallet selector/Browser", module)
  .add("initial loading state", () => (
    <WalletBrowserComponent
      isLoading={true}
      isLoginRoute={true}
      approvalRejected={false}
      tryConnectingWithBrowserWallet={action("tryConnectingWithBrowserWallet")}
    />
  ))
  .add("error message", () => (
    <WalletBrowserComponent
      isLoading={false}
      errorMessage={createMessage(BrowserWalletErrorMessage.GENERIC_ERROR)}
      isLoginRoute={true}
      approvalRejected={false}
      tryConnectingWithBrowserWallet={action("tryConnectingWithBrowserWallet")}
    />
  ))
  .add("approval rejected", () => (
    <WalletBrowserComponent
      isLoading={false}
      errorMessage={createMessage(BrowserWalletErrorMessage.GENERIC_ERROR)}
      isLoginRoute={true}
      approvalRejected={true}
      tryConnectingWithBrowserWallet={action("tryConnectingWithBrowserWallet")}
    />
  ));
