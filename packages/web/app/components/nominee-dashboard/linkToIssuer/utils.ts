import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import {
  ENomineeRequestError,
  ENomineeRequestStatus,
  INomineeRequest,
} from "../../../modules/nominee-flow/types";
import { isAddressValid } from "../../../modules/web3/utils";
import { EMaskedFormError } from "../../translatedMessages/messages";
import { ENomineeRequestComponentState } from "./types";

export const validateEthInput = (value: string | undefined) => {
  if (value === undefined) {
    return undefined;
  } else {
    let error = undefined;
    for (let [i, char] of value.split("").entries()) {
      if (i === 0 && char !== "0") {
        error = EMaskedFormError.INVALID_PREFIX;
        break;
        /*tslint:disable-next-line:no-duplicated-branches*/
      } else if (i === 1 && char !== "x") {
        error = EMaskedFormError.INVALID_PREFIX;
        break;
      } else if (i >= 2 && !RegExp(/[a-fA-F\d]/).test(char)) {
        error = EMaskedFormError.ILLEGAL_CHARACTER;
        break;
      } else if (i > 41) {
        error = EMaskedFormError.MAX_LENGTH_EXCEEDED;
        break;
      } else {
        error = undefined;
      }
    }
    return error;
  }
};

export const validateEthAddress = (value: string | undefined) => {
  if (value === undefined) {
    return false;
  } else {
    return isAddressValid(value);
  }
};

export const getNomineeRequestComponentState = (
  nomineeRequest: INomineeRequest | undefined,
  nomineeRequestError: ENomineeRequestError | string, //todo refactor when nominee request errors storage fixed
  nomineeEto: TEtoWithCompanyAndContractReadonly | undefined,
) => {
  if (!nomineeRequest && nomineeRequestError === ENomineeRequestError.REQUEST_EXISTS) {
    throw new Error("invalid nominee request state");
  } else if (!nomineeRequest && nomineeRequestError === ENomineeRequestError.NONE) {
    return ENomineeRequestComponentState.CREATE_REQUEST;
  } else if (!nomineeRequest && nomineeRequestError !== ENomineeRequestError.NONE) {
    return ENomineeRequestComponentState.REPEAT_REQUEST;
  } else if (nomineeRequest && nomineeRequest.state === ENomineeRequestStatus.PENDING) {
    return ENomineeRequestComponentState.WAIT_WHILE_RQUEST_PENDING;
  } else if (
    nomineeRequest &&
    nomineeRequest.state === ENomineeRequestStatus.APPROVED &&
    nomineeEto &&
    nomineeEto.etoId === nomineeRequest.etoId
  ) {
    return ENomineeRequestComponentState.SUCCESS;
  } else if (
    nomineeRequest &&
    nomineeRequest.state === ENomineeRequestStatus.APPROVED &&
    !nomineeEto
  ) {
    return ENomineeRequestComponentState.CREATE_ANOTHER_REQUEST;
  } else if (
    nomineeRequest &&
    nomineeRequest.state === ENomineeRequestStatus.APPROVED &&
    nomineeEto &&
    nomineeEto.etoId !== nomineeRequest.etoId
  ) {
    return ENomineeRequestComponentState.CREATE_ANOTHER_REQUEST;
  } else if (
    nomineeRequest &&
    nomineeRequest.state === ENomineeRequestStatus.REJECTED &&
    nomineeRequestError === ENomineeRequestError.NONE
  ) {
    return ENomineeRequestComponentState.CREATE_ANOTHER_REQUEST;
  } else if (
    nomineeRequest &&
    nomineeRequest.state === ENomineeRequestStatus.REJECTED &&
    nomineeRequestError !== ENomineeRequestError.NONE
  ) {
    return ENomineeRequestComponentState.REPEAT_REQUEST;
  } else {
    throw new Error("invalid nominee request state");
  }
};

//todo write tests for this
