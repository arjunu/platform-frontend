import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EETOStateOnChain } from "../../modules/eto/types";

export enum EEtoStep {
  VERIFICATION = "verification",
  FILL_INFORMATION_ABOUT_COMPANY = "fill_information_about_company",
  PUBLISH_LISTING_PAGE = "publish_listing_page",
  LISTING_PAGE_IN_REVIEW = "listing_page_in_review",
  UPLOAD_SIGNED_TERMSHEET = "upload_signed_termsheet",
  PUBLISH_INVESTMENT_OFFER = "publish_investment_offer",
  INVESTMENT_OFFER_IN_REVIEW = "investment_offer_in_review",
  UPLOAD_OFFERING_DOCUMENT = "upload_offering_document",
  UPLOAD_ISHA = "upload_isha",
  WAIT_FOR_SMART_CONTRACT = "wait_for_smart_contract",
  WAIT_FOR_NOMINEE_AGREEMENTS = "wait_for_nominee_agreements",
  SETUP_START_DATE = "setup_start_date",
  WAITING_FOR_FUNDRAISING_TO_START = "waiting_for_fundraising_to_start",
  FUNDRAISING_IS_LIVE = "fundraising_is_live",
  LINK_NOMINEE = "link_nominee",
  ETO_SUSPENDED_FROM_ON_CHAIN = "eto_suspended",
  FILL_INFORMATION_ABOUT_ETO = "fill_information_about_eto",
  SIGN_YOUR_ISHA = "sign_your_isha_agreement",
}

type TEtoStepArgs = {
  isVerificationSectionDone: boolean;
  etoState: EEtoState;
  etoOnChainState: EETOStateOnChain | undefined;
  shouldViewEtoSettings: boolean;
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview | undefined;
  isTermSheetSubmitted: boolean | undefined;
  isVotingRightsFilledWithAllRequired: boolean;
  isInvestmentFilledWithAllRequired: boolean;
  isEtoTermsFilledWithAllRequired: boolean;
  isOfferingDocumentSubmitted: boolean | undefined;
  isISHASubmitted: boolean | undefined;
  isNomineeLinked: boolean;
  areAgreementsSignedByNominee: boolean | undefined;
  preEtoStartDate: Date | undefined;
};

// TODO: This can be moved fully to redux selector
/**
 * Calculate current eto state
 * see ISSUER FLOW diagram in miro business logic details
 * @note Even when eto is in specific state in some cases it's still possible to access previous steps actions
 * (for e.g. publish marketing listing action is available until offer is fully published
 */
export const selectEtoStep = ({
  isVerificationSectionDone,
  etoState,
  etoOnChainState,
  shouldViewEtoSettings,
  isMarketingDataVisibleInPreview,
  isTermSheetSubmitted,
  isVotingRightsFilledWithAllRequired,
  isInvestmentFilledWithAllRequired,
  isEtoTermsFilledWithAllRequired,
  isOfferingDocumentSubmitted,
  isISHASubmitted,
  isNomineeLinked,
  areAgreementsSignedByNominee,
  preEtoStartDate,
}: TEtoStepArgs): EEtoStep | undefined => {
  if (!isVerificationSectionDone) {
    return EEtoStep.VERIFICATION;
  }

  if (etoState === EEtoState.PREVIEW) {
    const areEtoFormsFilledWithAllRequired =
      isInvestmentFilledWithAllRequired &&
      isEtoTermsFilledWithAllRequired &&
      isVotingRightsFilledWithAllRequired;

    if (isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.VISIBILITY_PENDING) {
      return EEtoStep.LISTING_PAGE_IN_REVIEW;
    }

    if (areEtoFormsFilledWithAllRequired && isTermSheetSubmitted) {
      return EEtoStep.PUBLISH_INVESTMENT_OFFER;
    }

    /**
     * When all eto forms are filled (which also means nominee is linked)
     * And term sheet was not yet submitted
     */
    if (areEtoFormsFilledWithAllRequired && !isTermSheetSubmitted) {
      return EEtoStep.UPLOAD_SIGNED_TERMSHEET;
    }

    /**
     * When nominee was linked but still not all eto forms where filled correctly
     */
    if (!areEtoFormsFilledWithAllRequired && isNomineeLinked) {
      return EEtoStep.FILL_INFORMATION_ABOUT_ETO;
    }

    /**
     * When investment and eto terms form are filled correctly
     * Or when marketing data is visible
     * And when nominee is not linked yet
     */
    if (
      (isInvestmentFilledWithAllRequired && isEtoTermsFilledWithAllRequired) ||
      (isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.VISIBLE &&
        !isNomineeLinked)
    ) {
      return EEtoStep.LINK_NOMINEE;
    }

    if (
      shouldViewEtoSettings &&
      isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.NOT_VISIBLE
    ) {
      return EEtoStep.PUBLISH_LISTING_PAGE;
    }

    return EEtoStep.FILL_INFORMATION_ABOUT_COMPANY;
  }

  if (etoState === EEtoState.PENDING) {
    return EEtoStep.INVESTMENT_OFFER_IN_REVIEW;
  }

  if (etoState === EEtoState.LISTED || etoState === EEtoState.PROSPECTUS_APPROVED) {
    if (isISHASubmitted) {
      return EEtoStep.WAIT_FOR_SMART_CONTRACT;
    }

    if (isOfferingDocumentSubmitted) {
      return EEtoStep.UPLOAD_ISHA;
    }

    return EEtoStep.UPLOAD_OFFERING_DOCUMENT;
  }

  if (etoState === EEtoState.ON_CHAIN) {
    if (etoOnChainState === EETOStateOnChain.Setup) {
      if (preEtoStartDate !== undefined) {
        return EEtoStep.WAITING_FOR_FUNDRAISING_TO_START;
      }

      if (areAgreementsSignedByNominee === undefined) {
        return undefined;
        /**
         * When nominee sign THA and RAA agreements we can set start date
         */
      } else if (areAgreementsSignedByNominee) {
        return EEtoStep.SETUP_START_DATE;
      }

      return EEtoStep.WAIT_FOR_NOMINEE_AGREEMENTS;
    }

    if (etoOnChainState === EETOStateOnChain.Signing) {
      return EEtoStep.SIGN_YOUR_ISHA;
    }

    return EEtoStep.FUNDRAISING_IS_LIVE;
  }

  if (etoState === EEtoState.SUSPENDED) {
    return EEtoStep.ETO_SUSPENDED_FROM_ON_CHAIN;
  }

  throw new Error("Eto step is not defined");
};
