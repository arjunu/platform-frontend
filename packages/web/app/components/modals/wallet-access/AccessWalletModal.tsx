import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { actions } from "../../../modules/actions";
import {
  selectIsUnlocked,
  selectWalletSubType,
  selectWalletType,
} from "../../../modules/web3/selectors";
import { EWalletSubType, EWalletType } from "../../../modules/web3/types";
import { appConnect } from "../../../store";
import { TTranslatedString } from "../../../types";
import { HiResImage } from "../../shared/HiResImage";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { Modal } from "../Modal";
import { AccessLightWalletPrompt } from "./AccessLightWalletPrompt";

import * as ledgerConfirm from "../../../assets/img/wallet_selector/ledger_confirm.svg";
import * as lockIcon from "../../../assets/img/wallet_selector/lock_icon.svg";
import * as styles from "./AccessWalletModal.module.scss";

interface IStateProps {
  errorMessage?: TTranslatedString;
  title?: TTranslatedString;
  message?: TTranslatedString;
  walletType: EWalletType | undefined;
  walletSubType: EWalletSubType | undefined;
  isUnlocked: boolean;
  inputLabel?: TTranslatedString;
}

interface IDispatchProps {
  onAccept: (password?: string) => void;
}

interface IExternalProps {
  title?: TTranslatedString;
  message?: TTranslatedString;
}

export const AccessWalletContainerComponent: React.FunctionComponent<
  IStateProps & IDispatchProps
> = ({
  title,
  message,
  errorMessage,
  isUnlocked,
  onAccept,
  walletType,
  walletSubType,
  inputLabel,
}) => (
  <div className="text-center">
    {title && <h1 className={styles.title}>{title}</h1>}
    {message && <p>{message}</p>}
    {walletType === EWalletType.LIGHT && (
      <div>
        <img src={lockIcon} className="mt-3 mb-3" alt="" />
        <AccessLightWalletPrompt
          onAccept={onAccept}
          isUnlocked={isUnlocked}
          inputLabel={inputLabel}
        />
      </div>
    )}
    {walletType === EWalletType.LEDGER && (
      <div>
        <img src={ledgerConfirm} className="mt-1 mb-3" />
        <div className={cn("mt-2", styles.info)}>
          <FormattedMessage id="modal.access-wallet.ledger-info" />
        </div>
      </div>
    )}
    {walletType === EWalletType.BROWSER && (
      <div>
        <HiResImage
          partialPath={
            "wallet_selector/" +
            (walletSubType === EWalletSubType.GNOSIS ? "logo_gnosis" : "logo_metamask")
          }
          alt={walletSubType}
          title={walletSubType}
          className="mt-3 mb-3"
        />
        <div className={cn("mt-2", styles.info)}>
          {walletSubType === EWalletSubType.GNOSIS ? (
            <FormattedMessage id="modal.access-wallet.gnosis-info" />
          ) : (
            <FormattedMessage id="modal.access-wallet.metamask-info" />
          )}
        </div>
      </div>
    )}
    {errorMessage && <p className={cn("mt-3", "text-warning")}>{errorMessage}</p>}
  </div>
);

export const AccessWalletContainer = appConnect<IStateProps, IDispatchProps, IExternalProps>({
  stateToProps: (s, external) => ({
    isOpen: s.accessWallet.isModalOpen,
    errorMessage: s.accessWallet.errorMessage
      ? getMessageTranslation(s.accessWallet.errorMessage)
      : undefined,
    title: external.title
      ? external.title
      : s.accessWallet.modalTitle && getMessageTranslation(s.accessWallet.modalTitle),
    message: external.message
      ? external.message
      : s.accessWallet.modalMessage && getMessageTranslation(s.accessWallet.modalMessage),
    inputLabel: s.accessWallet.inputLabel && getMessageTranslation(s.accessWallet.inputLabel),
    walletType: selectWalletType(s.web3),
    walletSubType: selectWalletSubType(s.web3),
    isUnlocked: selectIsUnlocked(s.web3),
  }),
  dispatchToProps: dispatch => ({
    onAccept: (password?: string) => dispatch(actions.accessWallet.accept(password)),
  }),
})(AccessWalletContainerComponent);

interface IModalStateProps {
  isOpen: boolean;
}

interface IModalDispatchProps {
  onCancel: () => void;
}

const AccessWalletModalComponent: React.FunctionComponent<
  IModalStateProps & IModalDispatchProps
> = props => (
  <Modal isOpen={props.isOpen} onClose={props.onCancel}>
    <AccessWalletContainer />
  </Modal>
);

export const AccessWalletModal = appConnect<IModalStateProps, IModalDispatchProps>({
  stateToProps: s => ({
    isOpen: s.accessWallet.isModalOpen,
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.accessWallet.hideAccessWalletModal()),
  }),
})(AccessWalletModalComponent);
