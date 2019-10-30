import { createActionFactory } from "@neufund/shared";

import { Dictionary } from "../../types";
import { ENomineeRequestError, INomineeRequest, TNomineeRequestStorage } from "./types";
import { TEtoWithCompanyAndContract } from "../eto/types";

export const nomineeFlowActions = {
  calculateNomineeTask: createActionFactory("NOMINEE_CALCULATE_TASK"), //n
  loadNomineeEtos: createActionFactory("NOMINEE_FLOW_LOAD_ETOS"), //-
  loadNomineeTaskData: createActionFactory("NOMINEE_FLOW_LOAD_NOMINEE_TASK_DATA"),//n
  storeNomineeTaskData: createActionFactory("NOMINEE_FLOW_SET_NOMINEE_TASKS_STATUS", tasks => ({
    tasks,
  })),//n
  startNomineeRequestsWatcher: createActionFactory("NOMINEE_FLOW_START_NOMINEE_REQUESTS_WATCHER"),
  stopNomineeRequestsWatcher: createActionFactory("NOMINEE_FLOW_STOP_NOMINEE_REQUESTS_WATCHER"),
  createNomineeRequest: createActionFactory(
    "NOMINEE_FLOW_CREATE_NOMINEE_REQUEST",
    (issuerId: string) => ({ issuerId }),
  ), //n
  loadNomineeRequests: createActionFactory(
    "NOMINEE_FLOW_LOAD_NOMINEE_REQUESTS"
  ),
  setNomineeRequests: createActionFactory( //for saving all of them
    "NOMINEE_FLOW_SET_NOMINEE_REQUESTS",
    (nomineeRequests: TNomineeRequestStorage) => ({nomineeRequests})
  ),
  storeNomineeRequest: createActionFactory( //for saving the newly created one //n
    "NOMINEE_FLOW_SET_NOMINEE_LINK_REQUEST",
    (etoId: string, nomineeRequest: INomineeRequest) => ({ etoId, nomineeRequest }),
  ),
  storeNomineeRequestError: createActionFactory(
    "NOMINEE_FLOW_SET_NOMINEE_LINK_REQUEST_ERROR",
    (etoId: string, requestError: ENomineeRequestError) => ({ etoId, requestError }),
  ),
  loadingDone: createActionFactory("NOMINEE_FLOW_LOADING_DONE"), //n
  trySetActiveNomineeEto: createActionFactory(
    "NOMINEE_FLOW_TRY_SET_ACTIVE_ETO",
    (previewCode: string) => ({ previewCode }),
  ),//not used?
  setActiveNomineeEto: createActionFactory(
    "NOMINEE_FLOW_SET_ACTIVE_ETO",
    (previewCode: string | undefined) => ({ previewCode }),
  ), //n
  changeActiveNomineeEto: createActionFactory(
    "NOMINEE_FLOW_CHANGE_ACTIVE_ETO",
    (etoId: string | undefined) => ({ etoId }),
  ), //not used?
  setNomineeEtos: createActionFactory(
    "NOMINEE_FLOW_SET_ETOS",
    ({
      etos,
      // companies,
      // contracts
    }: {
      etos: Dictionary<TEtoWithCompanyAndContract>;
      // companies: Dictionary<TCompanyEtoData>;
      // contracts: Dictionary<IEtoContractData>
    }) => ({ etos}),
  ),//n
};
