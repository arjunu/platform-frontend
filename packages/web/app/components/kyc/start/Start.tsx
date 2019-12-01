import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { compose } from "recompose";

import { EKycRequestType } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { KycStep } from "../shared/KycStep";
import { SelectTypeCard } from "../shared/SelectTypeCard";

import * as styles from "./Start.module.scss";

type TProps = {
  goToPerson: () => void;
  goToCompany: () => void;
};

export const KYCStartComponent: React.FunctionComponent<TProps> = ({ goToPerson, goToCompany }) => (
  <>
    <KycStep
      step={1}
      allSteps={5}
      title={<FormattedMessage id="kyc.start.title" />}
      description={<FormattedHTMLMessage tagName="span" id="kyc.start.description" />}
    />
    <section className={styles.cardsContainer}>
      <SelectTypeCard kycType={EKycRequestType.INDIVIDUAL} onClick={goToPerson} />
      <SelectTypeCard kycType={EKycRequestType.BUSINESS} onClick={goToCompany} />
    </section>
  </>
);

export const KYCStart = compose<TProps, {}>(
  appConnect<TProps>({
    dispatchToProps: dispatch => ({
      goToPerson: () => dispatch(actions.routing.goToKYCIndividualStart()),
      goToCompany: () => dispatch(actions.routing.goToKYCBusinessData()),
    }),
  }),
)(KYCStartComponent);
