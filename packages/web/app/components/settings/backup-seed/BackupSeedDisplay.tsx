import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";

import { IWalletPrivateData } from "../../../modules/web3/reducer";
import { Button, EButtonLayout, EIconPosition } from "../../shared/buttons";
import { Heading } from "../../shared/Heading";
import { PrivateKeyDisplay } from "./PrivateKeyDisplay";

import arrowLeft from "../../../assets/img/inline_icons/arrow_left.svg";
import * as styles from "./BackupSeedDisplay.module.scss";

interface IBackupSeedDisplayProps {
  onNext: () => void;
  onBack: () => void;
  walletPrivateData: IWalletPrivateData;
  isModal?: boolean;
}
const BackupSeedDisplay: React.FunctionComponent<IBackupSeedDisplayProps> = ({
  walletPrivateData,
  isModal,
  onNext,
  onBack,
}) => (
  <>
    <section className={styles.words}>
      <Heading level={3} className="mb-3">
        <FormattedMessage id="components.settings.backup-seed-display.backup-seed" />
      </Heading>
      <Row className="justify-content-around no-gutters">
        {walletPrivateData.seed.map((word, index) => (
          <Col
            className={cn(styles.word, "mt-1 p-2 text-center")}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            key={index}
            data-test-id="seed-display-word"
          >
            {`${index + 1}.`}
            {isModal ? <div>{word}</div> : word}
          </Col>
        ))}
      </Row>
    </section>

    <PrivateKeyDisplay privateKey={walletPrivateData.privateKey} />

    {!isModal && (
      <Row className="justify-content-around">
        <Col className="mt-2" xs="auto">
          <Button
            layout={EButtonLayout.GHOST}
            iconPosition={EIconPosition.ICON_BEFORE}
            svgIcon={arrowLeft}
            onClick={onBack}
          >
            <FormattedMessage id="form.button.back" />
          </Button>
        </Col>
        <Col className="mt-2" xs="auto">
          <Button
            layout={EButtonLayout.GHOST}
            iconPosition={EIconPosition.ICON_BEFORE}
            onClick={onNext}
            data-test-id="seed-display-next-link"
          >
            <FormattedMessage id="form.button.continue" />
          </Button>
        </Col>
      </Row>
    )}
  </>
);

export { BackupSeedDisplay };
