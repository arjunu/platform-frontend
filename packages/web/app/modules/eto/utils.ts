import BigNumber from "bignumber.js";

import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
  TEtoSpecsData,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { DeepPartial, Overwrite } from "../../types";
import { EthereumAddressWithChecksum } from "../../utils/opaque-types/types";
import { isPastInvestment } from "../investor-portfolio/utils";
import {
  EETOStateOnChain,
  EEtoSubState,
  IEtoContractData,
  IEtoTotalInvestment,
  TEtoStartOfStates,
  TEtoWithCompanyAndContract,
} from "./types";

export const amendEtoToCompatibleFormat = (
  eto: DeepPartial<TEtoSpecsData>,
): DeepPartial<TEtoSpecsData> =>
  eto && {
    ...eto,
    product: {
      ...eto.product,
      jurisdiction:
        eto.product &&
        eto.product.jurisdiction &&
        (eto.product.jurisdiction.toUpperCase() as EJurisdiction),
    },
  };

export const convertToEtoTotalInvestment = (
  [totalEquivEurUlps, totalTokensInt, totalInvestors]: [BigNumber, BigNumber, BigNumber],
  euroTokenBalance: BigNumber,
  etherTokenBalance: BigNumber,
): IEtoTotalInvestment => ({
  totalEquivEurUlps: totalEquivEurUlps.toString(),
  totalTokensInt: totalTokensInt.toString(),
  totalInvestors: totalInvestors.toString(),
  euroTokenBalance: euroTokenBalance.toString(),
  etherTokenBalance: etherTokenBalance.toString(),
});

const convertToDate = (startOf: BigNumber): Date | undefined => {
  if (startOf.isZero()) {
    return undefined;
  }

  return new Date(startOf.mul("1000").toNumber());
};

export const convertToStateStartDate = (
  startOfStates: [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber],
): TEtoStartOfStates => {
  const [
    startOfSetup,
    startOfWhitelist,
    startOfPublic,
    startOfSigning,
    startOfClaim,
    startOfPayout,
    startOfRefund,
  ] = startOfStates.map(convertToDate);

  return {
    [EETOStateOnChain.Setup]: startOfSetup,
    [EETOStateOnChain.Whitelist]: startOfWhitelist,
    [EETOStateOnChain.Public]: startOfPublic,
    [EETOStateOnChain.Signing]: startOfSigning,
    [EETOStateOnChain.Claim]: startOfClaim,
    [EETOStateOnChain.Payout]: startOfPayout,
    [EETOStateOnChain.Refund]: startOfRefund,
  };
};

export function isOnChain(
  eto: TEtoWithCompanyAndContract,
): eto is Overwrite<
  TEtoWithCompanyAndContract,
  { contract: Exclude<TEtoWithCompanyAndContract["contract"], undefined> }
> {
  return eto.state === EEtoState.ON_CHAIN && eto.contract !== undefined;
}

export const isRestrictedEto = (eto: TEtoWithCompanyAndContract): boolean =>
  eto.product.jurisdiction === EJurisdiction.GERMANY && !isPastInvestment(eto.contract!.timedState);

/**
 * Check if user is associated with given eto
 * @returns true if user is either the issuer or nominee of the eto
 */
export const isUserAssociatedWithEto = (
  eto: TEtoWithCompanyAndContract,
  userId: EthereumAddressWithChecksum,
) => eto.companyId === userId || eto.nominee === userId;

type TCalculateSubStateOptions = {
  eto: TEtoSpecsData;
  contract: IEtoContractData | undefined;
  isEligibleToPreEto: boolean;
};

/**
 * Check if eto is still in preparation
 * @returns {boolean} true when ETO is either in PREVIEW or PENDING state
 */
export const isComingSoon = (state: EEtoState): boolean =>
  EEtoState.PREVIEW === state || EEtoState.PENDING === state;

/**
 * Calculates sub state of the ETO
 * Should not be connected with issuer or investor states
 * @todo Remove `isEligibleToPreEto` as it's related to investor
 */
export const getEtoSubState = ({
  eto,
  contract,
  isEligibleToPreEto,
}: TCalculateSubStateOptions): EEtoSubState | undefined => {
  switch (eto.state) {
    /**
     * Sub states 'PREVIEW' can generate
     * - MARKETING_LISTING_IN_REVIEW: after submitting marketing listing to review
     */
    case EEtoState.PREVIEW: {
      if (
        eto.isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING
      ) {
        return EEtoSubState.MARKETING_LISTING_IN_REVIEW;
      }

      return undefined;
    }

    case EEtoState.SUSPENDED:
    case EEtoState.PENDING:
      return undefined;

    case EEtoState.LISTED:
    case EEtoState.PROSPECTUS_APPROVED: {
      if (eto.isBookbuilding) {
        return EEtoSubState.WHITELISTING;
      }

      return EEtoSubState.CAMPAIGNING;
    }
    case EEtoState.ON_CHAIN: {
      if (!contract) {
        throw new Error(`Eto ${eto.etoId} is on chain but without contracts deployed`);
      }

      switch (contract.timedState) {
        case EETOStateOnChain.Setup:
          if (eto.isBookbuilding) {
            return EEtoSubState.WHITELISTING;
          }

          if (!eto.startDate) {
            return EEtoSubState.CAMPAIGNING;
          }

          return isEligibleToPreEto
            ? EEtoSubState.COUNTDOWN_TO_PRESALE
            : EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE;

        case EETOStateOnChain.Whitelist:
          if (!isEligibleToPreEto) {
            return EEtoSubState.COUNTDOWN_TO_PUBLIC_SALE;
          }

          return undefined;
      }

      return undefined;
    }
  }
};
