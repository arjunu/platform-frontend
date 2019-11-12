import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testCompany } from "../../../../test/fixtures";
import { TCompanyEtoData } from "../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { LegalInformationWidget } from "./LegalInformationWidget";

const emptyShareholders = {
  ...testCompany,
  shareholders: undefined,
};

const moreThanSix = {
  ...testCompany,
  shareholders: Array(12).fill({
    fullName: "The same, but different",
    shareCapital: 10000,
  }),
};

const withOthers = {
  ...testCompany,
  shareholders: Array(2).fill({
    fullName: "Shareholder",
    shareCapital: 10000,
  }),
};

storiesOf("ETO/PublicView/LegalInformationWidget", module)
  .add("default", () => <LegalInformationWidget companyData={testCompany} />)
  .add("empty shareholders", () => (
    <LegalInformationWidget companyData={(emptyShareholders as unknown) as TCompanyEtoData} />
  ))
  .add("more than 6 shareholders", () => <LegalInformationWidget companyData={moreThanSix} />)
  .add("with others", () => <LegalInformationWidget companyData={withOthers} />);
