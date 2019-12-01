import { isString } from "lodash/fp";
import * as queryString from "query-string";

import { ENomineeRequestStatusTranslation } from "../../components/translatedMessages/messages";
import { createMessage, TMessage } from "../../components/translatedMessages/utils";
import { TNomineeRequestResponse } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
  TEtoWithCompanyAndContractReadonly,
} from "../eto/types";
import { isOnChain } from "../eto/utils";
import { lazyLoadIpfsOnlyHash } from "./lazy";
import {
  ENomineeEtoSpecificTask,
  ENomineeRequestStatus,
  ENomineeTask,
  ENomineeTaskStatus,
  INomineeRequest,
  TNomineeRequestStorage,
  TNomineeTasksStatus,
} from "./types";

export const nomineeRequestToTranslationMessage = (status: ENomineeRequestStatus): TMessage => {
  switch (status) {
    case ENomineeRequestStatus.APPROVED:
      return createMessage(ENomineeRequestStatusTranslation.APPROVED);
    case ENomineeRequestStatus.PENDING:
      return createMessage(ENomineeRequestStatusTranslation.PENDING);
    case ENomineeRequestStatus.REJECTED:
      return createMessage(ENomineeRequestStatusTranslation.REJECTED);
  }
};

export const takeLatestNomineeRequest = (nomineeRequests: TNomineeRequestStorage) =>
  Object.keys(nomineeRequests).reduce((acc: INomineeRequest | undefined, etoId: string) => {
    const request = nomineeRequests[etoId];
    const date = new Date(request.updatedAt === null ? request.insertedAt : request.updatedAt);
    const accDate = acc && new Date(acc.updatedAt === null ? acc.insertedAt : acc.updatedAt);
    if (!accDate || accDate < date) {
      return request;
    } else {
      return acc;
    }
  }, undefined);

export const nomineeApiDataToNomineeRequests = (
  requests: TNomineeRequestResponse[],
): TNomineeRequestStorage =>
  requests.reduce<TNomineeRequestStorage>((acc, request) => {
    acc[request.etoId] = nomineeRequestResponseToRequestStatus(request);
    return acc;
  }, {});

export const etoApiDataToNomineeRequests = (
  requests: TNomineeRequestResponse[],
): TNomineeRequestStorage =>
  requests.reduce<TNomineeRequestStorage>((acc, request) => {
    acc[request.nomineeId] = nomineeRequestResponseToRequestStatus(request);
    return acc;
  }, {});

export const nomineeRequestResponseToRequestStatus = (
  response: TNomineeRequestResponse,
): INomineeRequest => {
  switch (response.state) {
    case "pending":
      return { ...response, state: ENomineeRequestStatus.PENDING };
    case "approved":
      return { ...response, state: ENomineeRequestStatus.APPROVED };
    case "rejected":
      return { ...response, state: ENomineeRequestStatus.REJECTED };
    default:
      throw new Error("invalid response");
  }
};

const compareByDate = (a: INomineeRequest, b: INomineeRequest) => {
  const dateA = new Date(a.updatedAt === null ? a.insertedAt : a.updatedAt);
  const dateB = new Date(b.updatedAt === null ? b.insertedAt : b.updatedAt);
  if (dateA === dateB) {
    return 0;
  } else {
    return dateA > dateB ? -1 : 1;
  }
};

export const nomineeRequestsToArray = (requests: TNomineeRequestStorage): INomineeRequest[] => {
  const requestsArray = Object.keys(requests).reduce((acc: INomineeRequest[], etoId: string) => {
    acc.push(requests[etoId]);
    return acc;
  }, []);

  return requestsArray
    .filter((request: INomineeRequest) => request.state === ENomineeRequestStatus.PENDING)
    .sort(compareByDate);
};

export const nomineeIsEligibleToSignTHAOrRAA = (
  nomineeEto: TEtoWithCompanyAndContractReadonly | undefined,
) =>
  !!nomineeEto &&
  isOnChain(nomineeEto) &&
  nomineeEto.contract.timedState === EETOStateOnChain.Setup &&
  nomineeEto.contract.startOfStates[EETOStateOnChain.Whitelist] === undefined;

export const nomineeIsEligibleToSignISHA = (nomineeEto: TEtoWithCompanyAndContractReadonly) =>
  isOnChain(nomineeEto) && nomineeEto.contract.timedState === EETOStateOnChain.Signing;

export type TGetNomineeTaskStepData = {
  activeEtoPreviewCode: string | undefined;
  nomineeTasksStatus: TNomineeTasksStatus;
  nomineeEtos: { [previewCode: string]: TEtoWithCompanyAndContract | undefined } | undefined;
};

export const EtoStateOnChainIsSigning = (
  { activeEtoPreviewCode, nomineeEtos }: TGetNomineeTaskStepData,
  etoStateToCheck: EETOStateOnChain,
) => {
  const eto = nomineeEtos && activeEtoPreviewCode && nomineeEtos[activeEtoPreviewCode];
  if (eto) {
    return !!eto.contract && eto.contract.timedState === etoStateToCheck;
  } else {
    return false;
  }
};

export const getNomineeTaskStep = (
  params: TGetNomineeTaskStepData,
): ENomineeTask | ENomineeEtoSpecificTask => {
  const { activeEtoPreviewCode, nomineeTasksStatus, nomineeEtos } = params;
  if (nomineeTasksStatus[ENomineeTask.ACCOUNT_SETUP] !== ENomineeTaskStatus.DONE) {
    return ENomineeTask.ACCOUNT_SETUP;
  } else if (nomineeTasksStatus[ENomineeTask.LINK_TO_ISSUER] !== ENomineeTaskStatus.DONE) {
    return ENomineeTask.LINK_TO_ISSUER;
  } else if (
    activeEtoPreviewCode &&
    nomineeTasksStatus.byPreviewCode[activeEtoPreviewCode][ENomineeEtoSpecificTask.ACCEPT_THA] !==
      ENomineeTaskStatus.DONE &&
    nomineeEtos &&
    nomineeIsEligibleToSignTHAOrRAA(nomineeEtos[activeEtoPreviewCode])
  ) {
    return ENomineeEtoSpecificTask.ACCEPT_THA;
  } else if (
    activeEtoPreviewCode &&
    nomineeTasksStatus.byPreviewCode[activeEtoPreviewCode][ENomineeEtoSpecificTask.ACCEPT_RAAA] !==
      ENomineeTaskStatus.DONE &&
    nomineeEtos &&
    nomineeIsEligibleToSignTHAOrRAA(nomineeEtos[activeEtoPreviewCode])
  ) {
    return ENomineeEtoSpecificTask.ACCEPT_RAAA;
  } else if (nomineeTasksStatus[ENomineeTask.LINK_BANK_ACCOUNT] !== ENomineeTaskStatus.DONE) {
    return ENomineeTask.LINK_BANK_ACCOUNT;
  } else if (
    EtoStateOnChainIsSigning(params, EETOStateOnChain.Signing) &&
    activeEtoPreviewCode &&
    nomineeTasksStatus.byPreviewCode[activeEtoPreviewCode][
      ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL
    ] !== ENomineeTaskStatus.DONE
  ) {
    return ENomineeEtoSpecificTask.REDEEM_SHARE_CAPITAL;
  } else if (
    EtoStateOnChainIsSigning(params, EETOStateOnChain.Signing) &&
    activeEtoPreviewCode &&
    nomineeTasksStatus.byPreviewCode[activeEtoPreviewCode][ENomineeEtoSpecificTask.ACCEPT_ISHA] !==
      ENomineeTaskStatus.DONE
  ) {
    return ENomineeEtoSpecificTask.ACCEPT_ISHA;
  } else {
    return ENomineeTask.NONE;
  }
};

export const getActiveEtoPreviewCodeFromQueryString = (query: string) => {
  const { eto } = queryString.parse(query);

  return isString(eto) ? eto : undefined;
};

const generateBuffer = (file: File): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result !== null) {
        return resolve(Buffer.from(reader.result as ArrayBuffer));
      } else {
        return reject("generateBuffer returned null");
      }
    };
    reader.onabort = () => reject("generateBuffer aborted");
    reader.onerror = (e: Event) => reject(e);
    reader.readAsArrayBuffer(file);
  });

export const generateHash = (buffer: Buffer): Promise<string> =>
  lazyLoadIpfsOnlyHash().then(Hash => Hash.of(buffer));

export const generateIpfsHash = (file: File) =>
  generateBuffer(file).then((buffer: Buffer) => generateHash(buffer));
