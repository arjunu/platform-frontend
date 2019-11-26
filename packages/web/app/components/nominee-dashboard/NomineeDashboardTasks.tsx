import * as React from "react";
import { compose, withProps } from "recompose";

import { ENomineeEtoSpecificTask, ENomineeTask } from "../../modules/nominee-flow/types";
import { NomineeDashboardContainer } from "./nomineeDashboardContainer/NomineeDashboardContainer";
import { getNomineeTasks, ITask, nomineeTasksData } from "./NomineeTasksData";

interface IDashboardProps {
  nomineeTasks: ITask[];
}

interface IExternalProps {
  nomineeTaskStep: ENomineeTask | ENomineeEtoSpecificTask;
}

const NomineeDashboardTasksLayout: React.FunctionComponent<IDashboardProps> = ({
  nomineeTasks,
}) => (
  <NomineeDashboardContainer>
    {nomineeTasks.map(({ taskRootComponent: TaskRootComponent, key }: ITask) => (
      <TaskRootComponent key={key} />
    ))}
  </NomineeDashboardContainer>
);

export const NomineeDashboardTasks = compose<IDashboardProps, IExternalProps>(
  withProps<IDashboardProps, IExternalProps>(({ nomineeTaskStep }) => ({
    nomineeTasks: getNomineeTasks(nomineeTasksData, nomineeTaskStep),
  })),
)(NomineeDashboardTasksLayout);
