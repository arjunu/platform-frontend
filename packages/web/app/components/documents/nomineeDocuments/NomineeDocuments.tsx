import * as React from "react";
import { Redirect } from "react-router";
import { branch, compose, renderComponent, setDisplayName } from "recompose";

import { IEtoDocument } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { actions } from "../../../modules/actions";
import { selectIsUserFullyVerified } from "../../../modules/auth/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { selectPendingDownloads } from "../../../modules/immutable-file/selectors";
import {
  selectActiveNomineeEto,
  selectNomineeEtoTemplatesArray,
  selectNomineeFlowHasError,
} from "../../../modules/nominee-flow/selectors";
import { appConnect } from "../../../store";
import { withContainer } from "../../../utils/withContainer.unsafe";
import { withMetaTags } from "../../../utils/withMetaTags.unsafe";
import { appRoutes } from "../../appRoutes";
import { Layout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import {
  ErrorBoundaryComponent,
  ErrorBoundaryLayout,
} from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { NomineeDocumentsLayout } from "./NomineeDocumentsLayout";

type TStateProps = {
  etoTemplates: IEtoDocument[];
  documentsGenerated: { [ipfsHash: string]: boolean };
};

type TGuardProps = {
  isUserFullyVerified: boolean;
  nomineeEto: TEtoWithCompanyAndContractReadonly | undefined;
  hasError: boolean;
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
      nomineeEto: selectActiveNomineeEto(state),
      isUserFullyVerified: selectIsUserFullyVerified(state),
      hasError: selectNomineeFlowHasError(state),
    }),
  }),
  branch<TGuardProps>(props => props.hasError, renderComponent(ErrorBoundaryComponent)),
  branch<TGuardProps>(
    props => !props.isUserFullyVerified,
    renderComponent(() => <Redirect to={appRoutes.dashboard} />),
  ),
  withContainer(Layout),
  branch<TGuardProps>(props => !props.nomineeEto, renderComponent(LoadingIndicator)),
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
