import {} from "@neufund/shared"
import { inject, injectable } from "inversify";

import { symbols } from "../../../di/symbols";
import { IHttpClient, IHttpResponse } from "../client/IHttpClient";
import {
  FileDescriptionValidator,
  TFileDescription,
  TFileType,
} from "../file-storage/FileStorage.interfaces";
import { IImmutableFileId } from "./ImmutableStorage.interfaces";

const BASE_PATH = "/api/immutable-storage";
const DOWNLOAD_DOCUMENT_PATH = "/download/";
const UPLOAD_DOCUMENT_PATH = "/upload";

@injectable()
export class ImmutableStorageApi {
  constructor(
    @inject(symbols.authorizedJsonHttpClient) private httpClient: IHttpClient,
    @inject(symbols.binaryHttpClient) private binaryHttpClient: IHttpClient,
  ) {}

  public async uploadFile(
    mime_type: TFileType,
    file: File,
  ): Promise<IHttpResponse<TFileDescription>> {
    const data = new FormData();
    data.append("file", file);

    const response = await this.httpClient.post<IHttpResponse<TFileDescription>>({
      baseUrl: BASE_PATH,
      url: UPLOAD_DOCUMENT_PATH + `?declared_mime_type=${mime_type}`,
      formData: data,
      responseSchema: FileDescriptionValidator,
    });

    return response.body;
  }

  public async getFile({
    ipfsHash,
    mimeType,
    placeholders,
    asPdf,
  }: IImmutableFileId): Promise<IHttpResponse<TFileDescription>> {
    const placeHolder = placeholders ? JSON.stringify(placeholders) : "";
    const response = await this.binaryHttpClient.get<IHttpResponse<TFileDescription>>({
      baseUrl: BASE_PATH,
      url: DOWNLOAD_DOCUMENT_PATH + ipfsHash,
      queryParams: {
        mime_type: mimeType,
        placeholders: placeHolder,
        as_pdf: asPdf,
      },
    });
    return response.body;
  }
}
