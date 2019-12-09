import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EKycRequestType } from "../../../lib/api/kyc/KycApi.interfaces";
import { TDataTestId } from "../../../types";
import { Container, EColumnSpan } from "../../layouts/Container";
import { Button, EButtonLayout } from "../../shared/buttons/Button";
import { InlineIcon } from "../../shared/icons/InlineIcon";

import * as company from "../../../assets/img/inline_icons/company.svg";
import * as individual from "../../../assets/img/inline_icons/individual.svg";
import * as styles from "./SelectTypeCard.module.scss";

type TProps = {
  kycType: EKycRequestType;
  onClick: () => void;
  isStarted?: boolean;
};

const SelectTypeCardPersonal: React.FunctionComponent = () => (
  <>
    <div className={styles.iconContainer}>
      <InlineIcon svgIcon={individual} width="64" height="64" />
    </div>
    <h3 className={styles.title}>
      <FormattedMessage id="shared.kyc.select-type.personal.title" />
    </h3>
    <p className={styles.description}>
      <FormattedMessage id="shared.kyc.select-type.personal.description" />
    </p>
  </>
);

const SelectTypeCardCompany: React.FunctionComponent = () => (
  <>
    <div className={styles.iconContainer}>
      <InlineIcon svgIcon={company} width="64" height="64" />
    </div>
    <h3 className={styles.title}>
      <FormattedMessage id="shared.kyc.select-type.company.title" />
    </h3>
    <p className={styles.description}>
      <FormattedMessage id="shared.kyc.select-type.company.description" />
    </p>
  </>
);

const SelectTypeCard: React.FunctionComponent<TProps & TDataTestId> = ({
  kycType,
  onClick,
  isStarted,
  "data-test-id": dataTestId,
}) => (
  <Container columnSpan={EColumnSpan.ONE_COL} className={styles.cardContainer}>
    <section className={styles.card}>
      {kycType === EKycRequestType.BUSINESS ? (
        <SelectTypeCardCompany />
      ) : (
        <SelectTypeCardPersonal />
      )}
      <Button
        className="mt-auto"
        onClick={onClick}
        layout={EButtonLayout.PRIMARY}
        data-test-id={dataTestId}
      >
        {isStarted ? (
          <FormattedMessage id="shared.kyc.select-type.continue" />
        ) : (
          <FormattedMessage id="shared.kyc.select-type.select" />
        )}
      </Button>
    </section>
  </Container>
);

export { SelectTypeCard };
