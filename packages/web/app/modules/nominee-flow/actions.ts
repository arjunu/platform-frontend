import { createActionFactory } from "@neufund/shared";

import { EEtoDocumentType } from "../../lib/api/eto/EtoFileApi.interfaces";
import { Dictionary } from "../../types";
import {
  SignedISHAStatus,
  TEtoWithCompanyAndContract,
  TEtoWithCompanyAndContractReadonly,
  TOfferingAgreementsStatus,
} from "../eto/types";
import {
  ENomineeEtoSpecificTask,
  ENomineeFlowError,
  ENomineeRequestError,
  ENomineeTask,
  INomineeRequest,
  TNomineeRequestStorage,
  TNomineeTasksStatus,
  TTaskSpecificData,
} from "./types";

export const nomineeFlowActions = {
  initNomineeTasks: createActionFactory("NOMINEE_INIT_TASKS"),
  storeNomineeTasksStatus: createActionFactory(
    "NOMINEE_STORE_TASK_STATUS",
    (nomineeTasksStatus: TNomineeTasksStatus) => ({ nomineeTasksStatus }),
  ),
  storeError: createActionFactory("NOMINEE_STORE_ERROR", (error: ENomineeFlowError) => ({ error })),
  nomineeDashboardView: createActionFactory("NOMINEE_DASHBOARD_VIEW"),
  getNomineeDashboardData: createActionFactory("NOMINEE_DASHBOARD_GET_DATA"),
  loadNomineeEto: createActionFactory("NOMINEE_ETO_VIEW"),
  nomineeDocumentsView: createActionFactory("NOMINEE_DOCUMENTS_VIEW"),
  loadNomineeEtos: createActionFactory("NOMINEE_FLOW_LOAD_ETOS"),
  loadNomineeTaskData: createActionFactory("NOMINEE_FLOW_LOAD_NOMINEE_TASK_DATA"),
  storeActiveNomineeTask: createActionFactory(
    "NOMINEE_FLOW_SET_NOMINEE_TASKS_STATUS",
    (
      activeNomineeTask: ENomineeTask | ENomineeEtoSpecificTask,
      nomineeTasksData: TTaskSpecificData,
    ) => ({
      activeNomineeTask,
      nomineeTasksData,
    }),
  ),
  startNomineeRequestsWatcher: createActionFactory("NOMINEE_FLOW_START_NOMINEE_REQUESTS_WATCHER"),
  stopNomineeRequestsWatcher: createActionFactory("NOMINEE_FLOW_STOP_NOMINEE_REQUESTS_WATCHER"),
  startNomineeViewWatcher: createActionFactory("NOMINEE_FLOW_START_NOMINEE_TASKS_WATCHER"),
  stopNomineeTaskWatcher: createActionFactory("NOMINEE_FLOW_STOP_NOMINEE_TASKS_WATCHER"),
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
  nomineeSetAgreementsStatus: createActionFactory(
    "NOMINEE_SET_AGREEMENTS_STATUS",
    (previewCode: string, statuses: TOfferingAgreementsStatus) => ({
      previewCode,
      statuses,
    }),
  ),
  nomineeLoadSignedInvestmentAgreement: createActionFactory(
    "NOMINEE_LOAD_INVESTMENT_AGREEMENT",
    (etoId: string, previewCode: string) => ({ etoId, previewCode }),
  ),
  nomineeSetInvestmentAgreementHash: createActionFactory(
    "NOMINEE_SET_INVESTMENT_AGREEMENT_URL",
    (previewCode: string, url: SignedISHAStatus["url"]) => ({ url, previewCode }),
  ),
  nomineeLoadEtoAgreementsStatus: createActionFactory(
    "NOMINEE_LOAD_AGREEMENTS_STATUS",
    (eto: TEtoWithCompanyAndContractReadonly) => ({
      eto,
    }),
  ),
  nomineeUploadIsha: createActionFactory(
    "NOMINEE_UPLOAD_ISHA",
    (file: File, documentType: EEtoDocumentType) => ({ file, documentType }),
  ),
  nomineeIshaCheckSuccess: createActionFactory(
    "NOMINEE_ISHA_CHECK_SUCCESS",
    (previewCode: string, uploadedFileName: string) => ({ previewCode, uploadedFileName }),
  ),
  nomineeIshaCheckError: createActionFactory(
    "NOMINEE_ISHA_CHECK_ERROR",
    (previewCode: string, uploadedFileName: string) => ({ previewCode, uploadedFileName }),
  ),
  nomineeIshaUploadInProgress: createActionFactory(
    "NOMINEE_ISHA_UPLOAD_IN_PROGRESS",
    (previewCode: string) => ({ previewCode }),
  ),
  nomineeRemoveUploadedIsha: createActionFactory(
    "NOMINEE_REMOVE_UPLOADED_ISHA",
    (previewCode: string) => ({ previewCode }),
  ),
  setNomineeEtoSpecificTasksData: createActionFactory(
    "NOMINEE_SET_ETO_SPECIFIC_TASKS",
    tasksByPreviewCode => ({ tasksByPreviewCode }),
  ),
  setNomineeEtoSpecificTasksStatus: createActionFactory(
    "NOMINEE_SET_ETO_SPECIFIC_TASKS_STATUS",
    tasksStatusByPreviewCode => ({ tasksStatusByPreviewCode }),
  ),
};
