import { makeAllRequiredExcept } from "@neufund/shared"
import * as Yup from "yup";

import { ECountries } from "../../../utils/enums/countriesEnum";
import { EUSState } from "../../../utils/enums/usStatesEnum";
import * as YupTS from "../../yup-ts.unsafe";
import { countryCode, percentage, personBirthDate, restrictedCountry } from "../util/customSchemas";

export enum EKycRequestType {
  /**
   * "none" means not yet verified
   */
  NONE = "none",
  BUSINESS = "business",
  INDIVIDUAL = "individual",
}

export type TInstantIdNoneProvider = "none";
export type TManualIdProvider = "manual";

export enum EKycInstantIdProvider {
  ID_NOW = "id_now",
  ONFIDO = "onfido",
}

export enum EKycInstantIdStatus {
  DRAFT = "draft",
  PENDING = "pending",
}

export interface IKycPerson {
  firstName?: string;
  lastName?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  usState?: EUSState;
  birthDate?: string;
  placeOfBirth?: string;
  nationality?: string;
  isPoliticallyExposed?: boolean;
  // TODO: Remove when not needed. This adds additional fields required by backend
  isHighIncome?: boolean;
}

const stateSchema = Yup.string().when("country", (country: string, schema: Yup.Schema<string>) =>
  country === ECountries.UNITED_STATES ? schema.required() : schema,
);

/*
  TODO: This is legacy schema, remove when refactoring KYC is done
 */
export const KycPersonSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  street: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  country: restrictedCountry,
  birthDate: personBirthDate,
  placeOfBirth: countryCode,
  nationality: countryCode,
  isPoliticallyExposed: Yup.bool(),
  usState: Yup.string(),
  id: Yup.string(),
});

// Base schema for personal details
export const KycPersonalDataSchema = Yup.object().shape({
  birthDate: personBirthDate,
  country: restrictedCountry,
  firstName: Yup.string(),
  lastName: Yup.string(),
  nationality: countryCode,
  placeOfBirth: countryCode,
  id: Yup.string(),
});

// Base schema for address
const KycBaseAddressSchema = Yup.object().shape({
  street: Yup.string(),
  additionalInformation: Yup.string(),
  city: Yup.string(),
  zipCode: Yup.string(),
  country: restrictedCountry,
});

// Address schema with required usState when country is set to US
export const KycPersonalAddressSchema = KycBaseAddressSchema.concat(
  Yup.object().shape({
    usState: stateSchema,
  }),
);

// Schema used for checking responses from API with all fields optional
export const KycFullIndividualSchema = KycPersonalDataSchema.concat(KycBaseAddressSchema).concat(
  Yup.object().shape({
    usState: Yup.string(),
  }),
);

export const KycAdditionalDataSchema = Yup.object().shape({
  // Allow only true value to be saved, do not display any additional message
  // it is all handled by external notification component
  isAccreditedUsCitizen: Yup.bool().when(
    ["country", "nationality"],
    (v1: ECountries, v2: ECountries, schema: Yup.Schema<boolean>) =>
      [v1, v2].includes(ECountries.UNITED_STATES) ? schema.required().oneOf([true], " ") : schema,
  ),
});

// individual data
export interface IKycIndividualData extends IKycPerson {
  isHighIncome?: boolean;
  isAccreditedUsCitizen?: string;
}

export const KycStatusSchema = YupTS.object({
  inProhibitedRegion: YupTS.boolean(),
  instantIdProvider: YupTS.string<EKycInstantIdProvider | TInstantIdNoneProvider>(),
  instantIdStatus: YupTS.string<EKycInstantIdStatus>().optional(),
  originCountry: YupTS.string<ECountries>().optional(),
  recommendedInstantIdProvider: YupTS.string<EKycInstantIdProvider | TInstantIdNoneProvider>(),
  status: YupTS.string<EKycRequestStatus>(),
  supportedInstantIdProviders: YupTS.array(YupTS.string<EKycInstantIdProvider>()),
  type: YupTS.string<EKycRequestType>(),
});

export type TKycStatus = YupTS.TypeOf<typeof KycStatusSchema>;

export const KycPersonalDataSchemaRequired = makeAllRequiredExcept(KycPersonalDataSchema, ["id"]);
export const KycPersonalAddressSchemaRequired = makeAllRequiredExcept(KycPersonalAddressSchema, [
  "additionalInformation",
  "usState",
]);

export const KycIdNowIdentificationSchema = YupTS.object({
  redirectUrl: YupTS.string(),
});

export type TKycIdNowIdentification = YupTS.TypeOf<typeof KycIdNowIdentificationSchema>;

export const KycPersonalDataSchemaRequiredWithAdditionalData = KycPersonalDataSchemaRequired.concat(
  KycAdditionalDataSchema,
);

// business data
export interface IKycBusinessData {
  name?: string;
  registrationNumber?: string;
  legalForm?: string;
  legalFormType?: EKycBusinessType;
  street?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  jurisdiction?: string;
}

export const KycBusinessDataSchema = Yup.object<any>().shape({
  name: Yup.string().required(),
  registrationNumber: Yup.string().required(),
  legalForm: Yup.string().required(),
  legalFormType: Yup.string(),
  street: Yup.string().required(),
  city: Yup.string().required(),
  zipCode: Yup.string().required(),
  country: restrictedCountry.required(),
  jurisdiction: Yup.string().default("de"),
  usState: stateSchema,
});

// legal representative (same as base person)
export interface IKycLegalRepresentative extends IKycPerson {}
export const KycLegalRepresentativeSchema = makeAllRequiredExcept(KycPersonSchema, ["id"]);
export const KycLegalRepresentativeSchemaRequired = makeAllRequiredExcept(KycPersonSchema, [
  "usState",
  "id",
]);

// beneficial owner
export interface IKycBeneficialOwner extends IKycPerson {
  ownership?: number;
  id?: string;
}

export const KycBeneficialOwnerSchema = KycPersonSchema.concat(
  Yup.object().shape({
    ownership: percentage,
    id: Yup.string(),
  }),
);
export const KycBeneficialOwnerSchemaRequired = makeAllRequiredExcept(KycBeneficialOwnerSchema, [
  "usState",
]);

// file
export interface IKycFileInfo {
  id: string;
  fileName: string;
  preview?: string;
}

export const KycFileInfoShape = Yup.object().shape({
  id: Yup.string(),
  fileName: Yup.string(),
});

// request state
export enum EKycRequestStatus {
  DRAFT = "draft",
  PENDING = "pending",
  OUTSOURCED = "outsourced",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  IGNORED = "ignored",
}

export enum EKycBusinessType {
  CORPORATE = "corporate",
  SMALL = "small",
  PARTNERSHIP = "partnership",
}

export const KycBankVerifiedBankAccountSchema = YupTS.object({
  bankAccountNumberLast4: YupTS.string(),
  bankName: YupTS.string(),
  isSepa: YupTS.boolean(),
  name: YupTS.string(),
  swiftCode: YupTS.string(),
});

export const KycBankQuintessenceBankAccountSchema = YupTS.object({
  bankAccountNumber: YupTS.string(),
  bankName: YupTS.string(),
  isSepa: YupTS.boolean(),
  name: YupTS.string(),
  swiftCode: YupTS.string(),
});

export const KycBankAccountSchema = YupTS.object({
  ourAccount: KycBankQuintessenceBankAccountSchema,
  verifiedUserAccount: KycBankVerifiedBankAccountSchema.optional(),
});

export const KycBankTransferPurposeSchema = YupTS.object({
  purpose: YupTS.string(),
});

export type KycBankVerifiedBankAccount = YupTS.TypeOf<typeof KycBankVerifiedBankAccountSchema>;
export type KycBankQuintessenceBankAccount = YupTS.TypeOf<
  typeof KycBankQuintessenceBankAccountSchema
>;
export type TKycBankAccount = YupTS.TypeOf<typeof KycBankAccountSchema>;
export type TKycBankTransferPurpose = YupTS.TypeOf<typeof KycBankTransferPurposeSchema>;

export const KycOnfidoUploadRequestSchema = YupTS.object({
  webtoken: YupTS.string(),
});

export type TKycOnfidoUploadRequest = YupTS.TypeOf<typeof KycOnfidoUploadRequestSchema>;

export const KycOnfidoCheckRequestSchema = YupTS.object({
  result: YupTS.string().optional(),
  status: YupTS.string(),
});

export type TKycOnfidoCheckRequest = YupTS.TypeOf<typeof KycOnfidoCheckRequestSchema>;
