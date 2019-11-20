import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../../../utils/connectedRouting";
import { EtoRegistrationCompanyInformation } from "./pages/CompanyInformation";
import { EtoEquityTokenInfo } from "./pages/EtoEquityTokenInfo";
import { EtoRegistrationMedia } from "./pages/EtoMedia";
import { EtoRegistrationPitch } from "./pages/EtoPitch/EtoRegistrationPitch";
import { EtoRegistrationTerms } from "./pages/EtoTerms";
import { EtoVotingRights } from "./pages/EtoVotingRights/EtoVotingRights";
import { EtoInvestmentTerms } from "./pages/InvestmentTerms";
import { EtoRegistrationKeyIndividuals } from "./pages/KeyIndividuals";
import { EtoRegistrationLegalInformation } from "./pages/LegalInformation/LegalInformation";
import { EtoRegistrationRiskAssessment } from "./pages/RiskAssessment";
import { etoRegisterRoutes } from "./routes";

export const EtoRegisterRouter: React.FunctionComponent = () => (
  <SwitchConnected>
    <Route
      path={etoRegisterRoutes.companyInformation}
      component={EtoRegistrationCompanyInformation}
      exact
    />
    <Route
      path={etoRegisterRoutes.legalInformation}
      component={EtoRegistrationLegalInformation}
      exact
    />
    <Route
      path={etoRegisterRoutes.keyIndividuals}
      component={EtoRegistrationKeyIndividuals}
      exact
    />
    <Route path={etoRegisterRoutes.productVision} component={EtoRegistrationPitch} exact />
    <Route
      path={etoRegisterRoutes.etoRiskAssessment}
      component={EtoRegistrationRiskAssessment}
      exact
    />
    <Route path={etoRegisterRoutes.etoTerms} component={EtoRegistrationTerms} exact />
    <Route path={etoRegisterRoutes.etoEquityTokenInfo} component={EtoEquityTokenInfo} exact />
    <Route path={etoRegisterRoutes.etoVotingRights} component={EtoVotingRights} exact />
    <Route path={etoRegisterRoutes.etoInvestmentTerms} component={EtoInvestmentTerms} exact />
    <Route path={etoRegisterRoutes.etoMedia} component={EtoRegistrationMedia} exact />
    <Redirect to={etoRegisterRoutes.companyInformation} />
  </SwitchConnected>
);
