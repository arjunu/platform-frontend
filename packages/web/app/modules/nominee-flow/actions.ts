import { createActionFactory } from "@neufund/shared";

import { Dictionary } from "../../types";
import { TEtoWithCompanyAndContract } from "../eto/types";
import { TNomineeTasksStatus } from "./reducer";
import {
  ENomineeEtoSpecificTask,
  ENomineeRequestError,
  ENomineeTask,
  INomineeRequest,
  TNomineeRequestStorage,
} from "./types";

export const nomineeFlowActions = {
  initNomineeTasks: createActionFactory("NOMINEE_INIT_TASKS"),
  storeNomineeTasksStatus: createActionFactory(
    "NOMINEE_STORE_TASK_STATUS",
    (nomineeTasksStatus: TNomineeTasksStatus) => ({ nomineeTasksStatus }),
  ),
  nomineeDashboardView: createActionFactory("NOMINEE_DASHBOARD_VIEW"),
  nomineeEtoView: createActionFactory("NOMINEE_ETO_VIEW"),
  nomineeDocumentsView: createActionFactory("NOMINEE_DOCUMENTS_VIEW"),
  loadNomineeEtos: createActionFactory("NOMINEE_FLOW_LOAD_ETOS"),
  loadNomineeTaskData: createActionFactory("NOMINEE_FLOW_LOAD_NOMINEE_TASK_DATA"),
  storeActiveNomineeTask: createActionFactory(
    "NOMINEE_FLOW_SET_NOMINEE_TASKS_STATUS",
    (activeNomineeTask: ENomineeTask | ENomineeEtoSpecificTask) => ({
      activeNomineeTask,
    }),
  ),
  startNomineeRequestsWatcher: createActionFactory("NOMINEE_FLOW_START_NOMINEE_REQUESTS_WATCHER"),
  stopNomineeRequestsWatcher: createActionFactory("NOMINEE_FLOW_STOP_NOMINEE_REQUESTS_WATCHER"),
  startNomineeTaskWatcher: createActionFactory("NOMINEE_FLOW_START_NOMINEE_TASKS_WATCHER"),
  stopNomineeTaskWatcher: createActionFactory("NOMINEE_FLOW_START_NOMINEE_TASKS_WATCHER"),
  createNomineeRequest: createActionFactory(
    "NOMINEE_FLOW_CREATE_NOMINEE_REQUEST",
    (issuerId: string) => ({ issuerId }),
  ),
  loadNomineeRequests: createActionFactory("NOMINEE_FLOW_LOAD_NOMINEE_REQUESTS"),
  setNomineeRequests: createActionFactory(
    //for saving all of them
    "NOMINEE_FLOW_SET_NOMINEE_REQUESTS",
    (nomineeRequests: TNomineeRequestStorage) => ({ nomineeRequests }),
  ),
  storeNomineeRequest: createActionFactory(
    //for saving the newly created one
    "NOMINEE_FLOW_SET_NOMINEE_LINK_REQUEST",
    (etoId: string, nomineeRequest: INomineeRequest) => ({ etoId, nomineeRequest }),
  ),
  storeNomineeRequestError: createActionFactory(
    "NOMINEE_FLOW_SET_NOMINEE_LINK_REQUEST_ERROR",
    (etoId: string, requestError: ENomineeRequestError) => ({ etoId, requestError }),
  ),
  loadingDone: createActionFactory("NOMINEE_FLOW_LOADING_DONE"),
  startSetingActiveNomineeEtoPreviewCode: createActionFactory("NOMINEE_FLOW_TRY_SET_ACTIVE_ETO"),
  setActiveNomineeEtoPreviewCode: createActionFactory(
    "NOMINEE_FLOW_SET_ACTIVE_ETO",
    (previewCode: string | undefined) => ({ previewCode }),
  ),
  setActiveNomineeEtoPreviewCodeError: createActionFactory(
    "NOMINEE_FLOW_SET_ACTIVE_ETO_ERROR",
    (error: unknown) => ({ error }),
  ),
  setNomineeEtos: createActionFactory(
    "NOMINEE_FLOW_SET_ETOS",
    ({ etos }: { etos: Dictionary<TEtoWithCompanyAndContract> }) => ({ etos }),
  ),
  setNomineeEtosError: createActionFactory("NOMINEE_FLOW_SET_ETOS_ERROR", (error: unknown) => ({
    error,
  })),
};
