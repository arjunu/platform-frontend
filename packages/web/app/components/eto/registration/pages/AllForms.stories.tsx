import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { FormikValues } from "formik";
import * as React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";

import { Panel } from "../../../shared/Panel";
import { EtoRegistrationCompanyInformationComponent } from "./CompanyInformation";
import { EtoEquityTokenInfoComponent } from "./EtoEquityTokenInfo";
import { EtoRegistrationMediaComponent } from "./EtoMedia";
import { EtoRegistrationPitchComponent } from "./EtoPitch/EtoRegistrationPitch";
import { EtoVotingRightsComponent } from "./EtoVotingRights/EtoVotingRights";
import { EtoRegistrationKeyIndividualsComponent } from "./KeyIndividuals";
import { EtoRegistrationLegalInformationComponent } from "./LegalInformation/LegalInformation";
import { EtoRegistrationRiskAssessmentComponent } from "./RiskAssessment";

const eto = {};
const company = {};
const loadingState = {
  loadingData: false,
  savingData: false,
  readonly: false,
  stateValues: eto,
  initialValues: eto,
  company,
  saveData: action("saveData"),
  validationFn: (_: FormikValues) => {},
};

storiesOf("ETO-Flow/Registration-forms", module)
  .addDecorator(story => <Panel>{story()}</Panel>)
  .add("EtoEquityTokenInfo", () => <EtoEquityTokenInfoComponent {...loadingState} />)
  .add("EtoRegistrationCompanyInformation", () => (
    <EtoRegistrationCompanyInformationComponent {...loadingState} />
  ))
  .add("EtoRegistrationMedia", () => <EtoRegistrationMediaComponent {...loadingState} />)
  .add("EtoRegistrationPitch", () => <EtoRegistrationPitchComponent {...loadingState} />)
  .add("EtoVotingRights", () => (
    <Provider
      store={createStore(() => ({
        etoNominee: { isLoading: false },
        etoIssuer: { loading: false },
      }))}
    >
      <EtoVotingRightsComponent
        {...loadingState}
        currentNomineeId={"123"}
        currentNomineeName={"nominee"}
      />
      )}
    </Provider>
  ))
  .add("EtoRegistrationKeyIndividuals", () => (
    <EtoRegistrationKeyIndividualsComponent {...loadingState} />
  ))
  .add("EtoRegistrationLegalInformation", () => (
    <EtoRegistrationLegalInformationComponent {...loadingState} />
  ))
  .add("EtoRegistrationRiskAssessment", () => (
    <EtoRegistrationRiskAssessmentComponent {...loadingState} />
  ));
