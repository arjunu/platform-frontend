import { branch, compose, renderComponent } from "recompose";

import {
  selectNomineeDashboardIsReady,
  selectNomineeTaskStep,
} from "../../modules/nominee-flow/selectors";
import { ENomineeTask } from "../../modules/nominee-flow/types";
import { appConnect } from "../../store";
import { RequiredByKeys } from "../../types";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Layout } from "../layouts/Layout";
import { LoadingIndicator } from "../shared/loading-indicator/LoadingIndicator";
import { NomineeDashboardTasks } from "./NomineeDashboardTasks";

interface IStateProps {
  isReady: boolean;
  nomineeTaskStep: ENomineeTask | undefined;
}

interface IComponentProps {
  nomineeTaskStep: ENomineeTask | undefined;
}

export const NomineeDashboard = compose<RequiredByKeys<IComponentProps, "nomineeTaskStep">, {}>(
  withContainer(Layout),
  appConnect<IStateProps>({
    stateToProps: state => ({
      isReady: selectNomineeDashboardIsReady(state),
      nomineeTaskStep: selectNomineeTaskStep(state),
    }),
  }),
  branch<IStateProps>(
    props => !props.isReady,
    renderComponent(LoadingIndicator),
  ),
)(NomineeDashboardTasks);
