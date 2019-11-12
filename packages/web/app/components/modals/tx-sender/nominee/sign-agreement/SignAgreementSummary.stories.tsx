import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testCompany, testContract, testEto } from "../../../../../../test/fixtures";
import { TEtoWithCompanyAndContractReadonly } from "../../../../../modules/eto/types";
import { ETxSenderType } from "../../../../../modules/tx/types";
import { withModalBody } from "../../../../../utils/storybookHelpers.unsafe";
import { SignNomineeAgreementSummaryLayout } from "./SignAgreementSummary";

const eto: TEtoWithCompanyAndContractReadonly = {
  ...testEto,
  contract: testContract,
  company: testCompany,
};

storiesOf("NomineeAgreements/Summary", module)
  .addDecorator(withModalBody())
  .add("THA", () => (
    <SignNomineeAgreementSummaryLayout
      document={eto.templates.companyTokenHolderAgreement}
      nomineeEto={eto}
      txType={ETxSenderType.NOMINEE_THA_SIGN}
      downloadImmutableFile={action("DOWNLOAD")}
      onAccept={action("ACCEPT")}
    />
  ))
  .add("RAAA", () => (
    <SignNomineeAgreementSummaryLayout
      document={eto.templates.reservationAndAcquisitionAgreement}
      nomineeEto={eto}
      txType={ETxSenderType.NOMINEE_RAAA_SIGN}
      downloadImmutableFile={action("DOWNLOAD")}
      onAccept={action("ACCEPT")}
    />
  ));
