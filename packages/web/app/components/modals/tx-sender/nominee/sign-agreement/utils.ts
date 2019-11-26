import { IEtoDocument } from "../../../../../lib/api/eto/EtoFileApi.interfaces";
import { TEtoWithCompanyAndContractReadonly } from "../../../../../modules/eto/types";
import { ETxSenderType } from "../../../../../modules/tx/types";

export const selectDocument = (
  txType: ETxSenderType | undefined,
  nomineeEto: TEtoWithCompanyAndContractReadonly,
): IEtoDocument => {
  switch (txType) {
    case ETxSenderType.NOMINEE_THA_SIGN:
      return nomineeEto.templates.companyTokenHolderAgreement;
    case ETxSenderType.NOMINEE_RAAA_SIGN:
      return nomineeEto.templates.reservationAndAcquisitionAgreement;
    default:
      throw new Error("Incorrect transaction type");
  }
};

export const isRAASign = (txType: ETxSenderType | undefined) =>
  txType === ETxSenderType.NOMINEE_RAAA_SIGN;
