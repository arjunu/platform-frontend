import { inject, injectable } from "inversify";
import defaultTo from "lodash/defaultTo";
import mapValues from "lodash/mapValues";
import { array, lazy, object } from "yup"; // for only what you need

import { symbols } from "../../di/symbols";
import { Dictionary } from "../../types";
import { EEtoDocumentType } from "../api/eto/EtoFileApi.interfaces";
import { ILogger } from "../dependencies/logger";
import { ObjectStorage } from "./ObjectStorage";
import { Storage } from "./Storage";

export type TDocumentConfidentialityAgreements = Dictionary<Dictionary<EEtoDocumentType[]>>;

const schema = lazy<TDocumentConfidentialityAgreements>(users =>
  object(mapValues(users, etosPreviewCodes => object(mapValues(etosPreviewCodes, () => array())))),
);

export const STORAGE_DOCUMENT_CONFIDENTIALITY_AGREEMENTS_KEY =
  "NF_DOCUMENT_CONFIDENTIALITY_AGREEMENTS";

@injectable()
export class DocumentsConfidentialityAgreementsStorage {
  private readonly documentConfidentialityAgreementStorage: ObjectStorage<
    TDocumentConfidentialityAgreements
  >;

  constructor(
    @inject(symbols.storage) private readonly storage: Storage,
    @inject(symbols.logger) private readonly logger: ILogger,
  ) {
    this.documentConfidentialityAgreementStorage = new ObjectStorage<
      TDocumentConfidentialityAgreements
    >(this.storage, this.logger, STORAGE_DOCUMENT_CONFIDENTIALITY_AGREEMENTS_KEY);
  }

  public async markAgreementAsAccepted(
    userId: string,
    previewCode: string,
    documentType: EEtoDocumentType,
  ): Promise<void> {
    const acceptedAgreements = await this.getAndValidate();
    const userAcceptedAgreements = acceptedAgreements[userId] || {};

    const updatedAgreements = {
      ...acceptedAgreements,
      [userId]: {
        ...userAcceptedAgreements,
        [previewCode]: defaultTo(userAcceptedAgreements[previewCode], [])
          // remove duplicates
          .filter(type => type !== documentType)
          .concat(documentType),
      },
    };

    this.documentConfidentialityAgreementStorage.set(updatedAgreements);
  }

  public async isAgreementAccepted(
    userId: string,
    previewCode: string,
    documentType: EEtoDocumentType,
  ): Promise<boolean> {
    const acceptedAgreements = await this.getAndValidate();
    const userAcceptedAgreements = acceptedAgreements[userId] || {};

    if (Array.isArray(userAcceptedAgreements[previewCode])) {
      return userAcceptedAgreements[previewCode].includes(documentType);
    }

    return false;
  }

  private async getAndValidate(): Promise<TDocumentConfidentialityAgreements> {
    try {
      const validated = await schema.validate(this.documentConfidentialityAgreementStorage.get());

      return validated || {};
    } catch (e) {
      this.logger.warn("Invalid document confidentiality agreement storage schema", e);

      this.documentConfidentialityAgreementStorage.clear();

      return {};
    }
  }
}
