import * as React from "react";

import { ENomineeTask } from "../../modules/nominee-flow/types";
import { AcceptRAAA, AcceptTHA } from "./AcceptAgreement";
import { AcceptISHA } from "./AcceptIsha";
import { AccountSetup } from "./accountSetup/AccountSetup";
import { LinkBankAccount } from "./linkBankAccount/LinkBankAccount";
import { LinkToIssuer } from "./linkToIssuer/LinkToIssuer";
import { NoTasks } from "./NoTasks";
import { RedeemShareCapital } from "./RedeemShareCapital";

export interface ITaskData {
  key: ENomineeTask;
  taskRootComponent: React.ComponentType;
}

export interface ITask {
  key: ENomineeTask;
  taskRootComponent: React.ComponentType;
}

type TNomineeTasksData = { [key in ENomineeTask]: ITaskData };

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
  [ENomineeTask.ACCEPT_THA]: {
    key: ENomineeTask.ACCEPT_THA,
    taskRootComponent: AcceptTHA,
  },
  [ENomineeTask.ACCEPT_RAAA]: {
    key: ENomineeTask.ACCEPT_RAAA,
    taskRootComponent: AcceptRAAA,
  },
  [ENomineeTask.REDEEM_SHARE_CAPITAL]: {
    key: ENomineeTask.REDEEM_SHARE_CAPITAL,
    taskRootComponent: RedeemShareCapital,
  },
  [ENomineeTask.ACCEPT_ISHA]: {
    key: ENomineeTask.ACCEPT_ISHA,
    taskRootComponent: AcceptISHA,
  },
  [ENomineeTask.NONE]: {
    key: ENomineeTask.NONE,
    taskRootComponent: NoTasks,
  },
};

export const getNomineeTasks = (data: TNomineeTasksData, step: ENomineeTask) => [data[step]];
