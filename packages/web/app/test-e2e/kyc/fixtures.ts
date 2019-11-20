import { TFormFixture } from "../utils/forms";

const kycPersonBaseForm: TFormFixture = {
  firstName: "John",
  lastName: "Doe",
  birthDate: {
    value: "20/01/1980",
    type: "date",
  },
  street: "Cuvrystr. 6",
  city: "Berlin",
  zipCode: "10247",
  country: {
    value: "LI",
    type: "select",
  },
  placeOfBirth: {
    value: "AT",
    type: "select",
  },
  nationality: {
    value: "DE",
    type: "select",
  },
  isPoliticallyExposed: {
    value: "false",
    type: "select",
  },
};

const highIncome: TFormFixture =
  process.env.NF_DISABLE_HIGH_INCOME === "1"
    ? {}
    : {
        isHighIncome: {
          value: "true",
          type: "select",
        },
      };

export const kycInvidualForm: TFormFixture = {
  ...kycPersonBaseForm,
  ...highIncome,
  "kyc-personal-start-submit-form": {
    type: "submit",
  },
};

export const kycInvidualFormUS: TFormFixture = {
  ...kycPersonBaseForm,
  ...highIncome,
  nationality: {
    value: "US",
    type: "select",
  },
  isAccreditedUsCitizen: {
    value: "true",
    type: "select",
  },
};

export const kycLegalRepForm: TFormFixture = {
  ...kycPersonBaseForm,
  "kyc-company-legal-representative-save": {
    type: "submit",
  },
};

export const kycLegalRepDocsForm: TFormFixture = {
  "kyc-company-legal-representative-documents": {
    values: ["example.jpg"],
    type: "multiple-files",
  },
  "kyc-company-legal-representative-upload-and-submit": {
    type: "submit",
  },
};

export const kycCompanyForm: TFormFixture = {
  name: "Neufund",
  registrationNumber: "123456789",
  legalForm: "UG",
  street: "Cuvrystraße 6",
  city: "Berlin",
  zipCode: "10247",
  country: {
    value: "PL",
    type: "select",
  },
  "kyc-company-business-data-save": {
    type: "submit",
  },
};

export const kycCorporateCompanyForm: TFormFixture = {
  ...kycCompanyForm,
  jurisdiction: {
    value: "PL",
    type: "select",
  },
};

export const kycCompanyDocsForm: TFormFixture = {
  "kyc-company-business-supporting-documents": {
    values: ["example.jpg"],
    type: "multiple-files",
  },
  "kyc-company-business-supporting-continue": {
    type: "submit",
  },
};
