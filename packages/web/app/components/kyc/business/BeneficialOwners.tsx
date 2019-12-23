import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose } from "redux";

import { IKycBeneficialOwner } from "../../../lib/api/kyc/KycApi.interfaces";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { Accordion } from "../../shared/Accordion";
import { Button, EButtonLayout, EIconPosition } from "../../shared/buttons";
import { HorizontalLine } from "../../shared/HorizontalLine";
import { KYCBeneficialOwner } from "./BeneficialOwner";

import plusIcon from "../../../assets/img/inline_icons/plus.svg";
import * as styles from "./BeneficialOwners.module.scss";

interface IStateProps {
  beneficialOwners: ReadonlyArray<IKycBeneficialOwner>;
  loading: boolean;
}

interface IDispatchProps {
  createBeneficialOwner: () => void;
}

type IProps = IStateProps & IDispatchProps;

export const KYCBeneficialOwnersComponent: React.FunctionComponent<IProps> = props => (
  <div className={styles.beneficialOwners} data-test-id="kyc-beneficial-owners">
    <HorizontalLine className={cn("mt-2", "mb-2")} />
    <h4 className={styles.sectionTitle}>
      <FormattedMessage id="kyc.business.beneficial-owner.beneficial-owners" />
    </h4>
    <p>
      <FormattedMessage id="kyc.business.beneficial-owner.beneficial-owners-disclaimer" />
    </p>
    <Accordion>
      {props.beneficialOwners.map((owner, index) =>
        owner.id ? (
          <KYCBeneficialOwner key={owner.id} owner={owner} index={index} id={owner.id} />
        ) : (
          <div />
        ),
      )}
    </Accordion>
    <div className="p-4 text-center">
      <Button
        data-test-id="kyc-beneficial-owner-add-new"
        layout={EButtonLayout.GHOST}
        iconPosition={EIconPosition.ICON_BEFORE}
        svgIcon={plusIcon}
        onClick={props.createBeneficialOwner}
        disabled={props.loading}
      >
        <FormattedMessage id="kyc.business.beneficial-owner.add-new-beneficial-owner" />
      </Button>
    </div>
  </div>
);

export const KYCBeneficialOwners = compose<React.FunctionComponent>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      beneficialOwners: state.kyc.beneficialOwners,
      loading: !!state.kyc.loadingBeneficialOwners || !!state.kyc.loadingBeneficialOwner,
    }),
    dispatchToProps: dispatch => ({
      createBeneficialOwner: () => dispatch(actions.kyc.kycAddBeneficialOwner()),
    }),
  }),
  onEnterAction({
    actionCreator: dispatch => {
      dispatch(actions.kyc.kycLoadBeneficialOwners());
    },
  }),
)(KYCBeneficialOwnersComponent);
