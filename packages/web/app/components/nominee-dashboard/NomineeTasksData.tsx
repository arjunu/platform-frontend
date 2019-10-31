import * as React from "react";

import { ENomineeEtoSpecificTask, ENomineeTask } from "../../modules/nominee-flow/types";
import { AcceptRAAA, AcceptTHA } from "./AcceptAgreement";
import { AcceptISHA } from "./AcceptIsha";
import { AccountSetup } from "./accountSetup/AccountSetup";
import { LinkBankAccount } from "./linkBankAccount/LinkBankAccount";
import { LinkToIssuer } from "./linkToIssuer/LinkToIssuer";
import { NoTasks } from "./NoTasks";
import { RedeemShareCapital } from "./RedeemShareCapital";

export interface ITaskData {
  key: ENomineeTask | ENomineeEtoSpecificTask;
  taskRootComponent: React.ComponentType;
}

export interface ITask {
  key: ENomineeTask;
  taskRootComponent: React.ComponentType;
}

type TNomineeTasksData = { [key in ENomineeTask]: ITaskData } & { [key in ENomineeEtoSpecificTask]: ITaskData };

export const nomineeTasksData: TNomineeTasksData = {
  [ENomineeTask.ACCOUNT_SETUP]: {
    key: ENomineeTask.ACCOUNT_SETUP,
    taskRootComponent: AccountSetup,
  },
  [ENomineeTask.LINK_TO_ISSUER]: {
    key: ENomineeTask.LINK_TO_ISSUER,
    taskRootComponent: LinkToIssuer,
  },
  [ENomineeTask.LINK_BANK_ACCOUNT]: {
    key: ENomineeTask.LINK_BANK_ACCOUNT,
    taskRootComponent: LinkBankAccount,
  },
  [ENomineeEtoSpecificTask.ACCEPT_THA]: {
    key: ENomineeEtoSpecificTask.ACCEPT_THA,
    taskRootComponent: AcceptTHA,
  },
  [ENomineeEtoSpecificTask.ACCEPT_RAAA]: {
    key: ENomineeEtoSpecificTask.ACCEPT_RAAA,
    taskRootComponent: AcceptRAAA,
  },
  [ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL]: {
    key: ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL,
    taskRootComponent: RedeemShareCapital,
  },
  [ENomineeEtoSpecificTask.ACCEPT_ISHA]: {
    key: ENomineeEtoSpecificTask.ACCEPT_ISHA,
    taskRootComponent: AcceptISHA,
  },
  [ENomineeTask.NONE]: {
    key: ENomineeTask.NONE,
    taskRootComponent: NoTasks,
  },
};

export const getNomineeTasks = (data: TNomineeTasksData, step: ENomineeTask | ENomineeEtoSpecificTask) => [data[step]];
