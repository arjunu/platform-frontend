import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
  EKycBusinessType,
  EKycRequestType,
  IKycIndividualData,
} from "../../lib/api/kyc/KycApi.interfaces";
import { dummyIntl } from "../../utils/injectIntlHelpers.fixtures";
import { KYCBeneficialOwnerComponent } from "./business/BeneficialOwner.unsafe";
import { KYCBeneficialOwnersComponent } from "./business/BeneficialOwners";
import { KycBusinessDataComponent } from "./business/BusinessData.unsafe";
import { KycLegalRepresentativeComponent } from "./business/LegalRepresentative.unsafe";
import { KycPersonalDocumentVerificationComponent } from "./personal/DocumentVerification";
import { KYCPersonalStartComponent } from "./personal/Start.unsafe";
import { KYCUploadComponent } from "./personal/Upload";
import { KYCStartComponent } from "./start/Start";

const personalData = {
  firstName: "Sergiej",
  lastName: "Rewiakin",
  street: "Cuvrystr. 83",
  city: "Berlin",
  zipCode: "12345",
  country: "DE",
  birthDate: "1955-10-10",
  placeOfBirth: "DE",
  nationality: "DE",
  isPoliticallyExposed: false,
};

storiesOf("KYC/process", module).add("start", () => (
  <KYCStartComponent goToCompany={() => {}} goToPerson={() => {}} />
));

storiesOf("KYC/process", module).add("personal/start", () => {
  const currentValues: IKycIndividualData = {
    ...personalData,
    isHighIncome: false,
  };

  return (
    <KYCPersonalStartComponent
      currentValues={currentValues}
      loadingData={false}
      submitForm={() => {}}
      isSavingForm={false}
    />
  );
});

storiesOf("KYC/process", module).add("personal/documentVerification", () => {
  const props = {
    onStartInstantId: () => {},
    onManualVerification: () => {},
    layout: EKycRequestType.INDIVIDUAL,
  };
  return <KycPersonalDocumentVerificationComponent {...props} />;
});

storiesOf("KYC/process", module).add("personal/uploads", () => {
  const props = {
    fileUploading: false,
    filesLoading: false,
    files: [],
    layout: EKycRequestType.INDIVIDUAL,
    onDone: () => {},
    onDropFile: () => {},
    intl: dummyIntl,
  };
  return <KYCUploadComponent {...props} />;
});

storiesOf("KYC/process", module).add("business/legalRepresentative", () => {
  const props = {
    legalRepresentative: personalData,
    businessData: {
      name: "Neufund",
      registrationNumber: "12345",
      legalForm: "GmbH",
      legalFormType: EKycBusinessType.CORPORATE,
      jurisdiction: "DE",
    },
    loadingData: false,
    fileUploading: false,
    filesLoading: false,
    files: [],

    submitForm: () => {},
    onDropFile: () => {},
    onContinue: () => {},
    intl: dummyIntl,
  };
  return <KycLegalRepresentativeComponent {...props} />;
});

storiesOf("KYC/process", module).add("business/businessData", () => {
  const props = {
    businessData: {
      name: "Neufund",
      registrationNumber: "12345",
      legalForm: "GmbH",
      legalFormType: EKycBusinessType.SMALL,
      jurisdiction: "DE",
    },

    loadingData: false,
    fileUploading: false,
    filesLoading: false,
    files: [],

    submitForm: () => {},
    submit: () => {},
    onDropFile: () => {},
    onContinue: () => {},
    intl: dummyIntl,
  };
  return <KycBusinessDataComponent {...props} />;
});

storiesOf("KYC/process", module).add("business/beneficialOwners", () => {
  const props = {
    beneficialOwners: [],
    loadingData: false,
    fileUploading: false,
    filesLoading: false,
    files: [],
    loading: false,
    createBeneficialOwner: () => {},
    submitForm: () => {},
    submit: () => {},
    onDropFile: () => {},
    onContinue: () => {},
    intl: dummyIntl,
  };
  return <KYCBeneficialOwnersComponent {...props} />;
});

storiesOf("KYC/process", module).add("business/beneficialOwner", () => {
  const beneficialOwner = {
    ...personalData,
    ownership: 2,
    id: "12345",
  };

  const props = {
    owner: beneficialOwner,
    index: 1,
    fileUploading: false,
    filesLoading: false,
    files: [],
    loading: false,
    id: "1234547",
    submitForm: () => {},
    loadDocumentList: () => {},
    submit: () => {},
    delete: () => {},
    onDropFile: () => {},
  };
  return <KYCBeneficialOwnerComponent {...props} />;
});
