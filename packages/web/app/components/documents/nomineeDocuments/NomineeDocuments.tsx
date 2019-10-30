import * as React from "react";
import { Redirect } from "react-router";
import { branch, compose, renderComponent, setDisplayName } from "recompose";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { selectPendingDownloads } from "../../../modules/immutable-file/selectors";
import {
  selectNomineeEtoTemplatesArray,
  selectActiveNomineeEto,
  selectNomineeStateIsLoading,
} from "../../../modules/nominee-flow/selectors";
import { selectIsVerificationFullyDone } from "../../../modules/selectors";
import { appConnect } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { withContainer } from "../../../utils/withContainer.unsafe";
import { withMetaTags } from "../../../utils/withMetaTags.unsafe";
import { appRoutes } from "../../appRoutes";
import { Layout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { NomineeDocumentsLayout } from "./NomineeDocumentsLayout";

type TStateProps = {
  etoTemplates: IEtoDocument[];
  documentsGenerated: { [ipfsHash: string]: boolean };
};

type TGuardProps = {
  isLoading: boolean;
  verificationIsComplete: boolean;
  nomineeEto: TEtoWithCompanyAndContractReadonly | undefined;
};

interface IDispatchProps {
  generateTemplate: (document: IEtoDocument) => void;
}

type TComponentProps = {
  nomineeEto: TEtoWithCompanyAndContractReadonly | undefined;
  etoTemplates: IEtoDocument[];
  documentsGenerated: { [ipfsHash: string]: boolean };
  generateTemplate: (document: IEtoDocument) => void;
};

const NomineeDocuments = compose<TComponentProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  setDisplayName("Documents"),
  appConnect<TGuardProps>({
    stateToProps: state => ({
      isLoading: selectNomineeStateIsLoading(state),
      nomineeEto: selectActiveNomineeEto(state),
      verificationIsComplete: selectIsVerificationFullyDone(state),
    }),
  }),
  branch<TGuardProps>(
    props => !props.verificationIsComplete,
    renderComponent(() => <Redirect to={appRoutes.dashboard} />),
  ),
  onEnterAction({
    actionCreator: dispatch => dispatch(actions.nomineeFlow.loadNomineeTaskData()),
  }),
  withContainer(Layout),
  branch<TGuardProps>(
    props => props.isLoading || !props.nomineeEto,
    renderComponent(LoadingIndicator),
  ),
  appConnect<TStateProps, IDispatchProps>({
    stateToProps: state => ({
      etoTemplates: selectNomineeEtoTemplatesArray(state),
      documentsGenerated: selectPendingDownloads(state),
    }),
    dispatchToProps: dispatch => ({
      generateTemplate: document => dispatch(actions.etoDocuments.generateTemplate(document)),
    }),
  }),
  withMetaTags((_, intl) => ({ title: intl.formatIntlMessage("menu.documents-page") })),
)(NomineeDocumentsLayout);

export { NomineeDocuments, TComponentProps };
