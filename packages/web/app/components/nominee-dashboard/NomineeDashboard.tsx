import { branch, compose, renderComponent } from "recompose";

import {
  selectNomineeDashboardIsReady,
  selectNomineeFlowHasError,
  selectNomineeTaskStep,
} from "../../modules/nominee-flow/selectors";
import { ENomineeEtoSpecificTask, ENomineeTask } from "../../modules/nominee-flow/types";
import { appConnect } from "../../store";
import { RequiredByKeys } from "../../types";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
import { ErrorBoundaryComponent } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";
import { NomineeDashboardTasks } from "./NomineeDashboardTasks";

interface IStateProps {
  isReady: boolean;
  hasError: boolean;
  nomineeTaskStep: ENomineeTask | ENomineeEtoSpecificTask | undefined;
}

interface IComponentProps {
  nomineeTaskStep: ENomineeTask | ENomineeEtoSpecificTask | undefined;
}

export const NomineeDashboard = compose<RequiredByKeys<IComponentProps, "nomineeTaskStep">, {}>(
  withContainer(Layout),
  appConnect<IStateProps>({
    stateToProps: state => ({
      isReady: selectNomineeDashboardIsReady(state),
      hasError: selectNomineeFlowHasError(state),
      nomineeTaskStep: selectNomineeTaskStep(state),
    }),
  }),
  branch<IStateProps>(props => props.hasError, renderComponent(ErrorBoundaryComponent)),
  branch<IStateProps>(props => !props.isReady, renderComponent(LoadingIndicator)),
)(NomineeDashboardTasks);
