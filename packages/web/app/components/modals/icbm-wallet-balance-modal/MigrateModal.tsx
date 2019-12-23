import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { Col, Container, Row } from "reactstrap";

import {
  IWalletMigrationData,
  TWalletMigrationSteps,
} from "../../../modules/icbm-wallet-balance-modal/reducer";
import { myEtherWalletUrl } from "../../../utils/myEtherWallet";
import { ButtonArrowRight } from "../../shared/buttons";
import { ConfettiEthereum, EthereumIcon } from "../../shared/ethereum";
import { Heading } from "../../shared/Heading";
import { ExternalLink } from "../../shared/links";
import { InfoList } from "../tx-sender/shared/InfoList";
import { InfoRow } from "../tx-sender/shared/InfoRow";

import iconMyEtherWallet from "../../../assets/img/myEtherWallet.svg";
import * as styles from "./IcbmWalletBalanceModal.module.scss";

interface IMigrationModal {
  walletMigrationData: IWalletMigrationData;
  migrationStep: TWalletMigrationSteps;
  success: boolean;
  onGotoWallet: () => void;
  goToNextStep: () => void;
}

enum ETransactionStatus {
  SUCCESS = "success",
  WAITING = "waiting",
}

const MigrateFooter: React.FunctionComponent<{
  transactionStatus: ETransactionStatus;
  onGotoWallet: () => void;
  step: number;
  gotoNextStep: () => void;
}> = ({ transactionStatus, onGotoWallet, step, gotoNextStep }) => (
  <Container>
    {transactionStatus === ETransactionStatus.WAITING && (
      <Row className={styles.footerWaiting}>
        <EthereumIcon className={styles.animatedEthereum} />
        <FormattedMessage id="settings.modal.icbm-wallet-balance.footer.waiting-for-transaction" />
      </Row>
    )}
    {transactionStatus === ETransactionStatus.SUCCESS && (
      <Row className={styles.footerSuccess} noGutters>
        <Col xs="auto">
          <ConfettiEthereum className={styles.animatedEthereum} />
        </Col>
        <Col xs="auto">
          <Col>
            <FormattedMessage id="settings.modal.icbm-wallet-balance.footer.transaction-successful" />
          </Col>
          <Col>
            {step === 1 ? (
              <ButtonArrowRight
                onClick={gotoNextStep}
                data-test-id="modals.icbm-balance-modal.balance-footer.successful-transaction"
                className="px-0"
              >
                <FormattedMessage id="settings.modal.icbm-wallet-balance.button.go-to-next-step" />
              </ButtonArrowRight>
            ) : (
              <ButtonArrowRight
                onClick={onGotoWallet}
                className="px-0"
                data-test-id="modals.icbm-balance-modal.balance-footer.successful-transaction"
              >
                <FormattedMessage id="settings.modal.icbm-wallet-balance.button.wallet" />
              </ButtonArrowRight>
            )}
          </Col>
        </Col>
      </Row>
    )}
  </Container>
);

const MigrateHeader: React.FunctionComponent<{ step: number }> = ({ step }) => (
  <>
    <p className={styles.description}>
      <FormattedHTMLMessage
        tagName="span"
        id="settings.modal.icbm-wallet-balance.body.migrate.description"
      />
    </p>
    {step === 1 && (
      <>
        <Heading level={3} className={styles.header}>
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.step.1.title" />
        </Heading>
        <p className={styles.description}>
          <FormattedHTMLMessage
            tagName="span"
            id="settings.modal.icbm-wallet-balance.body.migrate.step.1.description"
          />
        </p>
      </>
    )}
    {step === 2 && (
      <>
        <Heading level={3} className={styles.header}>
          <div data-test-id="modals.icbm-balance-modal.migrate-body.step-2">
            <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.step.2.title" />
          </div>
        </Heading>
        <p className={styles.description}>
          <FormattedHTMLMessage
            tagName="span"
            id="settings.modal.icbm-wallet-balance.body.migrate.step.2.description"
          />
        </p>
      </>
    )}
  </>
);

const MigrateBody: React.FunctionComponent<{
  walletMigrationData: IWalletMigrationData;
}> = ({ walletMigrationData }) => (
  <>
    <p>
      <ExternalLink
        href={myEtherWalletUrl(
          walletMigrationData.smartContractAddress,
          walletMigrationData.value,
          walletMigrationData.gasLimit,
          walletMigrationData.migrationInputData,
        )}
      >
        <img src={iconMyEtherWallet} width={15} height={15} alt="" className="mr-2" />
        <FormattedMessage id="settings.modal.icbm-wallet-balance.body.my-ether-wallet" />
      </ExternalLink>
    </p>

    <InfoList>
      <InfoRow
        caption={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.to-smart-contract" />
        }
        value={walletMigrationData.smartContractAddress}
        data-test-id="modals.icbm-balance-modal.migrate-body.to"
        allowClipboardCopy={true}
      />

      <InfoRow
        caption={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.amount-to-sent" />
        }
        value={walletMigrationData.value}
        allowClipboardCopy={true}
      />

      <InfoRow
        caption={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.gas-limit" />
        }
        value={walletMigrationData.gasLimit}
        allowClipboardCopy={true}
        data-test-id="modals.icbm-balance-modal.migrate-body.gas-limit"
      />

      <InfoRow
        caption={
          <FormattedMessage id="settings.modal.icbm-wallet-balance.body.migrate.field.data" />
        }
        value={walletMigrationData.migrationInputData}
        allowClipboardCopy={true}
        data-test-id="modals.icbm-balance-modal.migrate-body.input-data"
      />
    </InfoList>
  </>
);

export const MigrateModal: React.FunctionComponent<IMigrationModal> = ({
  walletMigrationData,
  migrationStep,
  success,
  onGotoWallet,
  goToNextStep,
}) => (
  <>
    <Heading level={3} className={styles.header}>
      <FormattedMessage id="settings.modal.icbm-wallet-balance.title.migrate" />
    </Heading>

    <MigrateHeader step={migrationStep} />

    <MigrateBody walletMigrationData={walletMigrationData} />

    <MigrateFooter
      transactionStatus={success ? ETransactionStatus.SUCCESS : ETransactionStatus.WAITING}
      onGotoWallet={onGotoWallet}
      step={migrationStep}
      gotoNextStep={goToNextStep}
    />
  </>
);
