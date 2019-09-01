import { NumberSchema, StringSchema } from "yup";

import { ECurrency } from "../../../components/shared/formatters/utils";
import {
  getMessageTranslation,
  ValidationMessage,
} from "../../../components/translatedMessages/messages";
import { createMessage } from "../../../components/translatedMessages/utils";
import {
  MAX_PERCENTAGE,
  MIN_COMPANY_SHARES,
  MIN_EXISTING_COMPANY_SHARES,
  MIN_NEW_SHARES_TO_ISSUE,
  MIN_PRE_MONEY_VALUATION_EUR,
  MIN_SHARE_NOMINAL_VALUE_EUR,
  NEW_SHARES_TO_ISSUE_IN_FIXED_SLOTS,
  NEW_SHARES_TO_ISSUE_IN_WHITELIST,
} from "../../../config/constants";
import { DeepPartial, DeepReadonly, EthereumAddressWithChecksum } from "../../../types";
import * as YupTS from "../../yup-ts.unsafe";
import { dateSchema, percentage } from "../util/schemaHelpers.unsafe";
import { TEtoDocumentTemplates } from "./EtoFileApi.interfaces";
import { TEtoProduct } from "./EtoProductsApi.interfaces";

/** COMPANY ETO RELATED INTERFACES
 *  only deals with "/companies/me"
 */

const EtoFounderType = YupTS.object({
  fullName: YupTS.string(),
  role: YupTS.string(),
  bio: YupTS.string(),
});
export type TEtoFounder = YupTS.TypeOf<typeof EtoFounderType>;

const tagsType = YupTS.string();

const EtoCapitalListType = YupTS.object({
  description: YupTS.string().optional(),
  percent: YupTS.number()
    .optional()
    .enhance(() => percentage),
}).optional();

export const EtoCompanyInformationType = YupTS.object({
  brandName: YupTS.string(),
  companyWebsite: YupTS.url(),
  companyOneliner: YupTS.string(),
  companyDescription: YupTS.wysiwygString(),
  keyQuoteFounder: YupTS.string(),
  keyQuoteInvestor: YupTS.string().optional(),
  categories: YupTS.array(tagsType).optional(),
  companyLogo: YupTS.string().optional(),
  companyBanner: YupTS.string().optional(),
  companyPreviewCardBanner: YupTS.string(),
});
type TEtoTeamData = YupTS.TypeOf<typeof EtoCompanyInformationType>;

export const EtoPitchType = YupTS.object({
  problemSolved: YupTS.wysiwygString().optional(),
  productVision: YupTS.wysiwygString().optional(),
  inspiration: YupTS.wysiwygString().optional(),
  roadmap: YupTS.wysiwygString().optional(),
  useOfCapital: YupTS.string().optional(),
  useOfCapitalList: YupTS.array(EtoCapitalListType).optional(),
  customerGroup: YupTS.wysiwygString().optional(),
  sellingProposition: YupTS.wysiwygString().optional(),
  marketingApproach: YupTS.wysiwygString().optional(),
  companyMission: YupTS.wysiwygString().optional(),
  targetMarketAndIndustry: YupTS.wysiwygString().optional(),
  keyBenefitsForInvestors: YupTS.wysiwygString().optional(),
  keyCompetitors: YupTS.wysiwygString().optional(),
  marketTraction: YupTS.wysiwygString().optional(),
  businessModel: YupTS.wysiwygString().optional(),
});

type TEtoProductVision = YupTS.TypeOf<typeof EtoPitchType>;

export const EtoRiskAssessmentType = YupTS.object({
  riskNotRegulatedBusiness: YupTS.onlyTrue(),
  riskNoThirdPartyDependency: YupTS.onlyTrue(),
  riskNoLoansExist: YupTS.onlyTrue(),
  riskLiquidityDescription: YupTS.string().optional(),
  riskThirdPartyDescription: YupTS.string().optional(),
  riskThirdPartySharesFinancing: YupTS.string().optional(),
  riskBusinessModelDescription: YupTS.string().optional(),
  riskMaxDescription: YupTS.string().optional(),
});

type TEtoRiskAssessment = YupTS.TypeOf<typeof EtoRiskAssessmentType>;

const socialChannelsType = YupTS.array(
  YupTS.object({
    type: YupTS.string().optional(),
    url: YupTS.url().optional(),
  }),
);

export type TSocialChannelsType = YupTS.TypeOf<typeof socialChannelsType>;

export const EtoKeyIndividualType = YupTS.object({
  members: YupTS.array(
    YupTS.object({
      name: YupTS.string(),
      role: YupTS.string().optional(),
      image: YupTS.string().optional(),
      description: YupTS.string().optional(),
      website: YupTS.url().optional(),
      socialChannels: socialChannelsType.optional(),
    }),
  ).optional(),
});

export type TEtoKeyIndividualType = YupTS.TypeOf<typeof EtoKeyIndividualType>;

export const EtoKeyIndividualsType = YupTS.object({
  team: EtoKeyIndividualType.optional(),
  advisors: EtoKeyIndividualType.optional(),
  boardMembers: EtoKeyIndividualType.optional(),
  notableInvestors: EtoKeyIndividualType.optional(),
  keyCustomers: EtoKeyIndividualType.optional(),
  partners: EtoKeyIndividualType.optional(),
  keyAlliances: EtoKeyIndividualType.optional(),
});

type TEtoKeyIndividualsType = YupTS.TypeOf<typeof EtoKeyIndividualsType>;

const EtoLegalShareholderType = YupTS.object({
  fullName: YupTS.string().optional(),
  shares: YupTS.number()
    .optional()
    .enhance(v => v.moreThan(0)),
});

export type TEtoLegalShareholderType = YupTS.TypeOf<typeof EtoLegalShareholderType>;

export const EtoLegalInformationType = YupTS.object({
  name: YupTS.string(),
  legalForm: YupTS.string(),
  companyLegalDescription: YupTS.string(),
  street: YupTS.string(),
  country: YupTS.string(),
  vatNumber: YupTS.string().optional(),
  registrationNumber: YupTS.string(),
  foundingDate: YupTS.string().enhance((v: StringSchema) => dateSchema(v)),

  numberOfEmployees: YupTS.string().optional(),
  companyStage: YupTS.string().optional(),
  numberOfFounders: YupTS.number().optional(),
  lastFundingSizeEur: YupTS.number().optional(),
  companyShares: YupTS.number().enhance(v => v.min(MIN_COMPANY_SHARES)),
  shareholders: YupTS.array(EtoLegalShareholderType.optional()).optional(),
});

type TEtoLegalData = YupTS.TypeOf<typeof EtoLegalInformationType>;

const marketingLinksType = YupTS.array(
  YupTS.object({
    title: YupTS.string().optional(),
    url: YupTS.url().optional(),
  }),
);

const companyNewsType = YupTS.array(
  YupTS.object({
    title: YupTS.string().optional(),
    url: YupTS.url().optional(),
    publication: YupTS.string().optional(),
  }),
);

export const EtoMediaType = YupTS.object({
  companyVideo: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url().optional(),
  }).optional(),
  companySlideshare: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url().optional(),
  }).optional(),
  companyPitchdeckUrl: YupTS.object({
    title: YupTS.string().optional(), // optional in contrast to swagger, because filled in programmatically.
    url: YupTS.url(),
  }).optional(),
  socialChannels: socialChannelsType.optional(),
  companyNews: companyNewsType.optional(),
  marketingLinks: marketingLinksType.optional(),
  disableTwitterFeed: YupTS.boolean().optional(),
});

type TEtoMediaData = YupTS.TypeOf<typeof EtoMediaType>;

type TEtoCompanyBase = {
  companyId: string;
  city: string;
};

export type TCompanyEtoData = DeepReadonly<
  TEtoCompanyBase &
    TEtoTeamData &
    TEtoLegalData &
    TEtoProductVision &
    TEtoRiskAssessment &
    TEtoKeyIndividualsType &
    TEtoMediaData
>;

/** ETO SPEC RELATED INTERFACES
 *  only deals with "/etos/me"
 */

export enum EEtoState {
  PREVIEW = "preview",
  PENDING = "pending",
  LISTED = "listed",
  PROSPECTUS_APPROVED = "prospectus_approved",
  ON_CHAIN = "on_chain",
}

export enum EEtoMarketingDataVisibleInPreview {
  VISIBLE = "visible",
  NOT_VISIBLE = "not_visible",
  VISIBILITY_PENDING = "visibility_pending",
}

export enum EtoStateToCamelcase {
  "preview" = "preview",
  "pending" = "pending",
  "listed" = "listed",
  "prospectus_approved" = "prospectusApproved",
  "on_chain" = "onChain",
}
// Since only keys are transformed from snake case to camel case we have to manually map states
// see@ swagger /api/eto-listing/ui/#!/ETO/api_eto_get_me
// see@ swagger api/eto-listing/ui/#!/Documents/api_document_documents_state_info

export const getEtoTermsSchema = ({
  minTicketSize,
  maxTicketSize,
  maxWhitelistDurationDays,
  minWhitelistDurationDays,
  maxSigningDurationDays,
  minSigningDurationDays,
  maxPublicDurationDays,
  minPublicDurationDays,
}: Partial<TEtoProduct> = {}) =>
  YupTS.object({
    currencies: YupTS.array(YupTS.string<ECurrency>()),
    prospectusLanguage: YupTS.string(),
    minTicketEur: YupTS.number().enhance((v: NumberSchema) =>
      minTicketSize !== undefined
        ? v.min(
            minTicketSize,
            getMessageTranslation(
              createMessage(ValidationMessage.VALIDATION_TICKET_LESS_THAN_ACCEPTED, minTicketSize),
            ),
          )
        : v,
    ),
    maxTicketEur: YupTS.number()
      .optional()
      .enhance(v => {
        v = v.when("minTicketEur", (value: number) =>
          v.min(
            value,
            getMessageTranslation(
              createMessage(ValidationMessage.VALIDATION_TICKET_LESS_THAN_MINIMUM),
            ),
          ),
        );

        if (maxTicketSize && maxTicketSize > 0) {
          v = v.max(maxTicketSize);
        }

        return v;
      }),
    enableTransferOnSuccess: YupTS.boolean(),
    tokenTradeableOnSuccess: YupTS.boolean().optional(),
    whitelistDurationDays: YupTS.number().enhance(v => {
      if (minWhitelistDurationDays !== undefined) {
        v = v.min(minWhitelistDurationDays);
      }

      if (maxWhitelistDurationDays !== undefined) {
        v = v.max(maxWhitelistDurationDays);
      }

      return v;
    }),
    publicDurationDays: YupTS.number().enhance(v => {
      if (minPublicDurationDays !== undefined) {
        v = v.min(minPublicDurationDays);
      }

      if (maxPublicDurationDays !== undefined) {
        v = v.max(maxPublicDurationDays);
      }

      return v;
    }),
    signingDurationDays: YupTS.number().enhance(v => {
      if (minSigningDurationDays !== undefined) {
        v = v.min(minSigningDurationDays);
      }

      if (maxSigningDurationDays !== undefined) {
        v = v.max(maxSigningDurationDays);
      }

      return v;
    }),
  });

export type TEtoTermsType = YupTS.TypeOf<ReturnType<typeof getEtoTermsSchema>>;

export const EtoEquityTokenInfoType = YupTS.object({
  equityTokenName: YupTS.string(),
  equityTokenSymbol: YupTS.string(),
  equityTokenImage: YupTS.string(),
});

export type TEtoEquityTokenInfoType = YupTS.TypeOf<typeof EtoEquityTokenInfoType>;

export const EtoVotingRightsType = YupTS.object({
  liquidationPreferenceMultiplier: YupTS.number(),
  generalVotingRule: YupTS.string(),
  nominee: YupTS.string(),
});

export type TEtoVotingRightsType = YupTS.TypeOf<typeof EtoVotingRightsType>;

export const EtoInvestmentTermsType = YupTS.object({
  equityTokensPerShare: YupTS.number(),
  shareNominalValueEur: YupTS.number().enhance(v => v.min(MIN_SHARE_NOMINAL_VALUE_EUR)),
  preMoneyValuationEur: YupTS.number().enhance(v => v.min(MIN_PRE_MONEY_VALUATION_EUR)),
  existingCompanyShares: YupTS.number().enhance(v => v.min(MIN_EXISTING_COMPANY_SHARES)),
  authorizedCapitalShares: YupTS.number().optional(),
  newSharesToIssue: YupTS.number()
    .enhance(v => v.required())
    .enhance(v =>
      v.when("minimumNewSharesToIssue", (value: number) =>
        v.min(
          value,
          getMessageTranslation(
            createMessage(ValidationMessage.VALIDATION_MAX_NEW_SHARES_LESS_THAN_MINIMUM),
          ),
        ),
      ),
    ),
  minimumNewSharesToIssue: YupTS.number().enhance(v => v.min(MIN_NEW_SHARES_TO_ISSUE)),
  newSharesToIssueInWhitelist: YupTS.number()
    .optional()
    .enhance(v => v.min(NEW_SHARES_TO_ISSUE_IN_WHITELIST)),
  whitelistDiscountFraction: YupTS.number()
    .optional()
    .enhance(v => v.max(MAX_PERCENTAGE)),
  publicDiscountFraction: YupTS.number()
    .optional()
    .enhance(v => v.max(MAX_PERCENTAGE)),
  newSharesToIssueInFixedSlots: YupTS.number()
    .optional()
    .enhance(v => v.min(NEW_SHARES_TO_ISSUE_IN_FIXED_SLOTS)),
  fixedSlotsMaximumDiscountFraction: YupTS.number()
    .optional()
    .enhance(v => v.max(MAX_PERCENTAGE)),
  discountScheme: YupTS.string().optional(),
});

export type TEtoInvestmentTermsType = YupTS.TypeOf<typeof EtoInvestmentTermsType>;

interface IAdditionalEtoType {
  etoId: EthereumAddressWithChecksum;
  companyId: string;
  previewCode: string;
  state: EEtoState;
  isMarketingDataVisibleInPreview: EEtoMarketingDataVisibleInPreview;
  isBookbuilding: boolean;
  templates: TEtoDocumentTemplates;
  startDate: string;
  documents: TEtoDocumentTemplates;
  maxPledges: number;
  canEnableBookbuilding: boolean;
  product: TEtoProduct;
  nomineeDisplayName?: string;
  hasDividendRights?: boolean;
}

export type TBookbuildingStatsType = {
  amountEur: number;
  consentToRevealEmail: boolean;
  currency: string;
  email?: string;
  etoId?: string;
  insertedAt: string;
  updatedAt: string;
  userId: string;
};

export type TEtoSpecsData = TEtoTermsType &
  TEtoEquityTokenInfoType &
  TEtoVotingRightsType &
  TEtoInvestmentTermsType &
  IAdditionalEtoType;

/*General Interfaces */
export type TPartialEtoSpecData = DeepPartial<TEtoSpecsData>;
export type TPartialCompanyEtoData = DeepPartial<TCompanyEtoData>;

export type TGeneralEtoData = {
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
};

// this is coming from the /etos endpoint for investors dashboard
export type TEtoData = TEtoSpecsData & { company: TCompanyEtoData };

export const EtoMarketingDataType = YupTS.object({
  ...EtoEquityTokenInfoType.shape,
  ...EtoMediaType.shape,
  ...EtoLegalInformationType.shape,
  ...EtoPitchType.shape,
  ...EtoCompanyInformationType.shape,
  ...EtoRiskAssessmentType.shape,
});

export const ETOInvestmentAndEtoTermsDataType = YupTS.object({
  ...EtoInvestmentTermsType.shape,
  ...getEtoTermsSchema().shape,
});

export type TNomineeRequestResponse = {
  state: "pending" | "approved" | "rejected";
  nomineeId: string;
  etoId: string;
  insertedAt: string;
  updatedAt: string;
  metadata: {
    city: string;
    country: string;
    jurisdiction: string;
    legalForm: string;
    legalFormType: string;
    name: string;
    registrationNumber: string;
    street: string;
    zipCode: string;
  };
};
