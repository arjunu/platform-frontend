import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../../test/fixtures";
import { EEtoDocumentType, TEtoFormType } from "../../../lib/api/eto/EtoFileApi.interfaces";
import { ipfsLinkFromHash } from "../../documents/utils";
import { SignInvestmentAgreementLayout } from "./SignInvestmentAgreement";

const ipfsHash = "1243654we645";

const doc = {
  documentType: EEtoDocumentType.INVESTMENT_AND_SHAREHOLDER_AGREEMENT,
  form: "document" as TEtoFormType,
  ipfsHash,
  mimeType: "text/pdf",
  name: "signed Agreement",
};

const commonData = {
  eto: testEto,
  ipfsHash,
  uploadedAgreement: doc,
  signInvestmentAgreement: action("sign me"),
  signedInvestmentAgreementUrlLoading: false,
};

const noDocSignedData = {
  ...commonData,
  signedInvestmentAgreementUrl: undefined,
};

const needToSignAgainData = {
  ...commonData,
  signedInvestmentAgreementUrl: ipfsLinkFromHash("newHash"),
};

const waitingForNomineeData = {
  ...commonData,
  signedInvestmentAgreementUrl: ipfsLinkFromHash(ipfsHash),
};

storiesOf("ETO/SignInvestmentAgreement", module)
  .add("no doc signed", () => <SignInvestmentAgreementLayout {...noDocSignedData} />)
  .add("waiting for user to sign again", () => (
    <SignInvestmentAgreementLayout {...needToSignAgainData} />
  ))
  .add("waiting for nominee to sign", () => (
    <SignInvestmentAgreementLayout {...waitingForNomineeData} />
  ));
