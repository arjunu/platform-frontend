import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IHttpClient } from "../client/IHttpClient";
import { withParams } from "../../../utils/withParams";
import { TNomineeRequestResponse } from "./EtoApi.interfaces.unsafe";
import { ENomineeUpdateRequestStatus } from "../../../modules/nominee-flow/reducer";

const BASE_PATH = "/api/eto-listing/etos";
const CREATE_NOMINEE_REQUEST_PATH = "/:etoId/nominee-requests/me";
const GET_NOMINEE_REQUEST_PATH = "/nominee-requests/me";
const ETO_GET_NOMINEE_REQUEST_PATH = "/me/nominee-requests";
const ETO_UPDATE_NOMINEE_REQUEST_PATH = "/me/nominee-requests/:nomineeId";

export class EtoNomineeApiError extends Error {
}

export class IssuerIdInvalid extends EtoNomineeApiError {
}

export class NomineeRequestExists extends EtoNomineeApiError {
}

@injectable()
export class EtoNomineeApi {
  constructor(@inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient) {
  }

  public async createNomineeRequest(issuerId: string): Promise<TNomineeRequestResponse> {
    //according to our convention, etoId === issuerId during the eto preview stage
    const response = await this.httpClient.post<TNomineeRequestResponse>({
      baseUrl: BASE_PATH,
      url: withParams(CREATE_NOMINEE_REQUEST_PATH, { etoId: issuerId }),
      allowedStatusCodes: [400, 404, 409],
    });
    if (response.statusCode === 400 || response.statusCode === 404) {
      throw new IssuerIdInvalid();
    } else if (response.statusCode === 409) {
      throw new NomineeRequestExists();
    } else {
      return response.body;
    }
  }

  public async getNomineeRequests(): Promise<TNomineeRequestResponse[]> {
    const response = await this.httpClient.get<TNomineeRequestResponse[]>({
      baseUrl: BASE_PATH,
      url: GET_NOMINEE_REQUEST_PATH,
    });
    return response.body;
  }

  public async etoGetNomineeRequest(): Promise<TNomineeRequestResponse[]> {
    const response = await this.httpClient.get<TNomineeRequestResponse[]>({
      baseUrl: BASE_PATH,
      url: ETO_GET_NOMINEE_REQUEST_PATH,
    });
    return response.body;
  }

  public async etoUpdateNomineeRequest(nomineeId: string, state: ENomineeUpdateRequestStatus): Promise<void> {
    const response = await this.httpClient.put<void>({
      baseUrl: BASE_PATH,
      url: withParams(ETO_UPDATE_NOMINEE_REQUEST_PATH, { nomineeId }),
      body: state,
    });
    return response.body;
  }


}
