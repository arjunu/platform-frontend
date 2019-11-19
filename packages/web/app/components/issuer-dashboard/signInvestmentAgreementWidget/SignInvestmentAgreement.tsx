import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent, renderNothing } from "recompose";
import { compose } from "redux";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import {
  selectIssuerEtoWithCompanyAndContract,
  selectUploadedInvestmentAgreement,
} from "../../../modules/eto-flow/selectors";
import {
  selectInvestmentAgreementLoading,
  selectSignedInvestmentAgreementHash,
} from "../../../modules/eto/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { investmentAgreementNotSigned } from "../../documents/utils";
import { EColumnSpan } from "../../layouts/Container";
import { ButtonArrowRight } from "../../shared/buttons";
import {
  DashboardCenteredWidget,
  DashboardWidget,
} from "../../shared/dashboard-widget/DashboardWidget";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";

interface IDispatchProps {
  signInvestmentAgreement: (eto: TEtoWithCompanyAndContractReadonly, agreementHash: string) => void;
}

interface IStateProps {
  eto: TEtoWithCompanyAndContractReadonly;
  uploadedAgreement: IEtoDocument;
  signedInvestmentAgreementUrlLoading: boolean;
  signedInvestmentAgreementUrl: string | undefined;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

export const WaitingForNominee: React.FunctionComponent<IExternalProps> = ({ columnSpan }) => (
  <DashboardWidget
    data-test-id="dashboard-wait-for-nominee-to-sign-isha-widget"
    title={<FormattedMessage id="download-agreement-widget.wait-for-nominee-to-sign" />}
    text={<FormattedMessage id="download-agreement-widget.wait-for-nominee-to-sign-text" />}
    columnSpan={columnSpan}
  />
);

interface IWaitingToBeSigned {
  eto: TEtoWithCompanyAndContractReadonly;
  ipfsHash: string;
  signedInvestmentAgreementUrl: undefined | string;
  signInvestmentAgreement: (eto: TEtoWithCompanyAndContractReadonly, ipfsHash: string) => void;
}

export const WaitingToBeSigned: React.FunctionComponent<IWaitingToBeSigned & IExternalProps> = ({
  eto,
  ipfsHash,
  signedInvestmentAgreementUrl,
  signInvestmentAgreement,
  columnSpan,
}) => (
  <DashboardCenteredWidget
    data-test-id="dashboard-sign-isha-on-chain-widget"
    title={<FormattedMessage id="download-agreement-widget.sign-on-ethereum" />}
    text={
      signedInvestmentAgreementUrl === null ? (
        <FormattedMessage id="download-agreement-widget.sign-on-ethereum-text" />
      ) : (
        <FormattedMessage id="download-agreement-widget.sign-again-text" />
      )
    }
    columnSpan={columnSpan}
  >
    <ButtonArrowRight
      data-test-id="dashboard-sign-isha-on-chain-widget.sign"
      onClick={() => signInvestmentAgreement(eto, ipfsHash)}
    >
      <FormattedMessage id="download-agreement-widget.sign-on-ethereum" />
    </ButtonArrowRight>
  </DashboardCenteredWidget>
);

export const SignInvestmentAgreementLayout: React.FunctionComponent<
  IStateProps & IDispatchProps & IExternalProps
> = ({
  eto,
  signedInvestmentAgreementUrl,
  uploadedAgreement,
  signInvestmentAgreement,
  columnSpan,
}) =>
  investmentAgreementNotSigned(signedInvestmentAgreementUrl, uploadedAgreement.ipfsHash) ? (
    <WaitingToBeSigned
      eto={eto}
      ipfsHash={uploadedAgreement.ipfsHash}
      signedInvestmentAgreementUrl={signedInvestmentAgreementUrl}
      signInvestmentAgreement={signInvestmentAgreement}
      columnSpan={columnSpan}
    />
  ) : (
    <WaitingForNominee columnSpan={columnSpan} />
  );

export const SignInvestmentAgreement = compose<React.FunctionComponent<IExternalProps>>(
  appConnect<IStateProps | null, IDispatchProps>({
    stateToProps: state => {
      const uploadedAgreement = selectUploadedInvestmentAgreement(state);

      const eto = selectIssuerEtoWithCompanyAndContract(state);
      // there is another widget showing up if there's no agreement uploaded,
      // so uploadedAgreement=== null is not a valid case
      if (eto && uploadedAgreement) {
        return {
          eto,
          uploadedAgreement,
          signedInvestmentAgreementUrlLoading: selectInvestmentAgreementLoading(
            state,
            eto.previewCode,
          ),
          signedInvestmentAgreementUrl: selectSignedInvestmentAgreementHash(state, eto.previewCode),
        };
      } else {
        return null;
      }
    },
    dispatchToProps: dispatch => ({
      signInvestmentAgreement: (eto: TEtoWithCompanyAndContractReadonly, agreementHash: string) =>
        dispatch(actions.etoFlow.signInvestmentAgreement(eto, agreementHash)),
    }),
  }),
  branch<IStateProps | null>(props => props === null, renderNothing),
  onEnterAction<IStateProps>({
    actionCreator: (dispatch, props) =>
      dispatch(actions.eto.loadSignedInvestmentAgreement(props.eto.etoId, props.eto.previewCode)),
  }),
  branch<IStateProps>(
    props => props.signedInvestmentAgreementUrlLoading,
    renderComponent(LoadingIndicator),
  ),
)(SignInvestmentAgreementLayout);
