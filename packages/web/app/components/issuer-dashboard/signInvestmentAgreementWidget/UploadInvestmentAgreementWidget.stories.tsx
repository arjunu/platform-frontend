import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EEtoDocumentType, TEtoFormType } from "../../../lib/api/eto/EtoFileApi.interfaces";
import {
  EtoCompletedWidgetLayout,
  UploadInvestmentAgreementLayout,
} from "./UploadInvestmentAgreementWidget";

const ipfsHash = "1243654we645";

const doc = {
  documentType: EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT,
  form: "document" as TEtoFormType,
  ipfsHash,
  mimeType: "text/pdf",
  name: "signed Agreement",
};

const data = {
  agreementTemplate: doc,
  uploadedAgreement: doc,
  downloadAgreementTemplate: action("download agreement template"),
};

storiesOf("ETO/UploadInvestmentAgreement", module)
  .add("upload agreement template", () => <UploadInvestmentAgreementLayout {...data} />)
  .add("eto completed", () => <EtoCompletedWidgetLayout />);
