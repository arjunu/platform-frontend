import { withParams } from "@neufund/shared";
import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";
import { IPledge } from "./EtoPledgeApi.interfaces.unsafe";

const BASE_PATH = "/api/eto-listing/";
const MY_PLEDGE_PATH = "/etos/:etoId/pledges/me";

export class EtoPledgeApiError extends Error {}
export class EtoPledgeNotFound extends EtoPledgeApiError {}

const myPledgePathLink = (etoId: string) => withParams(MY_PLEDGE_PATH, { etoId });

@injectable()
export class EtoPledgeApi {
  constructor(
    @inject(symbols.authorizedJsonHttpClient) private authorizedHttpClient: IHttpClient,
  ) {}

  public async getMyPledge(etoId: string): Promise<IHttpResponse<IPledge>> {
    const response = await this.authorizedHttpClient.get<IPledge>({
      baseUrl: BASE_PATH,
      url: myPledgePathLink(etoId),
      allowedStatusCodes: [404],
    });

    if (response.statusCode === 404) {
      throw new EtoPledgeNotFound();
    }

    return response;
  }

  public saveMyPledge(etoId: string, pledge: IPledge): Promise<IHttpResponse<IPledge>> {
    return this.authorizedHttpClient.put<IPledge>({
      baseUrl: BASE_PATH,
      url: myPledgePathLink(etoId),
      body: pledge,
    });
  }

  public deleteMyPledge(etoId: string): Promise<IHttpResponse<IPledge>> {
    return this.authorizedHttpClient.delete<IPledge>({
      baseUrl: BASE_PATH,
      url: myPledgePathLink(etoId),
    });
  }
}
