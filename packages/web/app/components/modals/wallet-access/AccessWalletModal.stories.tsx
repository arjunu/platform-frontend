import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EWalletSubType, EWalletType } from "../../../modules/web3/types";
import { withModalBody } from "../../../utils/storybookHelpers.unsafe";
import {
  BrowserWalletErrorMessage,
  getMessageTranslation,
  MismatchedWalletAddressErrorMessage,
  ProfileMessage,
} from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { AccessWalletContainerComponent } from "./AccessWalletModal";

const props = {
  title: getMessageTranslation(createMessage(ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_TITLE)),
  message: getMessageTranslation(
    createMessage(ProfileMessage.PROFILE_ACCESS_RECOVERY_PHRASE_DESCRIPTION),
  ),
  errorMsg: undefined,
  isUnlocked: false,
  onAccept: action("onAccept"),
  tryToAccessWalletAgain: action("tryToAccessWalletAgain"),
  walletType: EWalletType.LIGHT,
  walletSubType: EWalletSubType.UNKNOWN,
};

storiesOf("AccessWalletModal", module)
  .addDecorator(withModalBody())
  .add("lightwallet", () => <AccessWalletContainerComponent {...props} />)
  .add("lightwallet with changed label and empty message", () => (
    <AccessWalletContainerComponent {...props} inputLabel={"This is changed label"} message={""} />
  ))
  .add("lightwallet-unlocked", () => (
    <AccessWalletContainerComponent {...props} isUnlocked={true} />
  ))
  .add("metamask", () => (
    <AccessWalletContainerComponent
      {...props}
      walletType={EWalletType.BROWSER}
      walletSubType={EWalletSubType.METAMASK}
    />
  ))
  .add("metamask with error", () => {
    const data = {
      ...props,
      errorMessage: getMessageTranslation(
        createMessage(BrowserWalletErrorMessage.WALLET_CONNECTED_TO_WRONG_NETWORK),
      ),
    };
    return (
      <AccessWalletContainerComponent
        {...data}
        walletType={EWalletType.BROWSER}
        walletSubType={EWalletSubType.METAMASK}
      />
    );
  })
  .add("ledger", () => (
    <AccessWalletContainerComponent {...props} walletType={EWalletType.LEDGER} />
  ))
  .add("ledger with error", () => {
    const testData = {
      ...props,
      errorMessage: getMessageTranslation(
        createMessage(MismatchedWalletAddressErrorMessage.MISMATCHED_WALLET_ADDRESS, {
          actualAddress: "12345",
          desiredAddress: "56789",
        }),
      ),
    };
    return <AccessWalletContainerComponent {...testData} walletType={EWalletType.LEDGER} />;
  });
