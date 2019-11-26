import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { etoFormIsReadonly } from "../../lib/api/eto/EtoApiUtils";
import {
  selectIsGeneralEtoLoading,
  selectIssuerCompany,
  selectIssuerEto,
  selectIssuerEtoState,
  userHasKycAndEmailVerified,
} from "../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../modules/eto-flow/types";
import {
  calculateCompanyInformationProgress,
  calculateEtoEquityTokenInfoProgress,
  calculateEtoKeyIndividualsProgress,
  calculateEtoMediaProgress,
  calculateEtoRiskAssessmentProgress,
  calculateEtoTermsProgress,
  calculateEtoVotingRightsProgress,
  calculateInvestmentTermsProgress,
  calculateLegalInformationProgress,
  calculateProductVisionProgress,
} from "../../modules/eto-flow/utils";
import { appConnect } from "../../store";
import { TTranslatedString } from "../../types";
import { etoRegisterRoutes } from "../eto/registration/routes";
import { Container, EColumnSpan, EContainerType } from "../layouts/Container";
import { Heading } from "../shared/Heading";
import { EtoFormProgressWidget } from "./EtoFormProgressWidget";

import * as styles from "./ETOFormsProgressSection.module.scss";

interface IEtoRegisteredRoutes {
  [id: string]: EEtoFormTypes;
}

interface IEtoSection {
  id: EEtoFormTypes;
  progress: number;
  name: TTranslatedString;
  testingId: string;
  hidden?: boolean;
  readonly?: boolean;
}

export interface IStateProps {
  etoStatus?: EEtoState;
  loadingData: boolean;
  shouldEtoDataLoad: boolean;
  companyInformationProgress: number;
  legalInformationProgress: number;
  etoTermsProgress: number;
  etoKeyIndividualsProgress: number;
  productVisionProgress: number;
  etoMediaProgress: number;
  etoRiskAssessmentProgress: number;
  etoEquityTokenInfoProgress: number;
  etoVotingRightsProgress: number;
  etoInvestmentTermsProgress: number;
  isMarketingDataVisibleInPreview?: EEtoMarketingDataVisibleInPreview;
}

interface IExternalProps {
  shouldViewEtoSettings?: boolean;
}

export const ETOFormsProgressSectionComponent: React.FunctionComponent<IStateProps &
  IExternalProps> = ({
  etoStatus,
  loadingData,
  shouldEtoDataLoad,
  companyInformationProgress,
  legalInformationProgress,
  etoTermsProgress,
  etoKeyIndividualsProgress,
  productVisionProgress,
  etoMediaProgress,
  etoRiskAssessmentProgress,
  etoEquityTokenInfoProgress,
  etoVotingRightsProgress,
  etoInvestmentTermsProgress,
  shouldViewEtoSettings,
}) => {
  const companySections: ReadonlyArray<IEtoSection> = [
    {
      id: EEtoFormTypes.CompanyInformation,
      progress: companyInformationProgress,
      name: <FormattedMessage id="eto.form-progress-widget.company-information.about" />,
      testingId: "eto-progress-widget-about",
      readonly: false,
    },
    {
      id: EEtoFormTypes.LegalInformation,
      progress: legalInformationProgress,
      name: <FormattedMessage id="eto.form-progress-widget.company-information.legal-info" />,
      testingId: "eto-progress-widget-legal-info",
    },
    {
      id: EEtoFormTypes.KeyIndividuals,
      progress: etoKeyIndividualsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.company-information.key-individuals" />,
      testingId: "eto-progress-widget-key-individuals",
    },
    {
      id: EEtoFormTypes.ProductVision,
      progress: productVisionProgress,
      name: <FormattedMessage id="eto.form-progress-widget.company-information.product-vision" />,
      testingId: "eto-progress-widget-product-vision",
    },
    {
      id: EEtoFormTypes.EtoMedia,
      progress: etoMediaProgress,
      name: <FormattedMessage id="eto.form-progress-widget.company-information.media" />,
      testingId: "eto-progress-widget-media",
    },
    {
      id: EEtoFormTypes.EtoEquityTokenInfo,
      progress: etoEquityTokenInfoProgress,
      name: <FormattedMessage id="eto.form-progress-widget.eto-settings.equity-token-info" />,
      testingId: "eto-progress-widget-equity-token-info",
    },
  ];

  const etoSections: ReadonlyArray<IEtoSection> = [
    {
      id: EEtoFormTypes.EtoTerms,
      progress: etoTermsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.eto-settings.eto-terms" />,
      testingId: "eto-progress-widget-eto-terms",
    },
    {
      id: EEtoFormTypes.EtoInvestmentTerms,
      progress: etoInvestmentTermsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.eto-settings.investment-terms" />,
      testingId: "eto-progress-widget-investment-terms",
    },
    {
      id: EEtoFormTypes.EtoVotingRights,
      progress: etoVotingRightsProgress,
      name: <FormattedMessage id="eto.form-progress-widget.eto-settings.voting-right" />,
      testingId: "eto-progress-widget-voting-right",
    },
    {
      id: EEtoFormTypes.EtoRiskAssessment,
      progress: etoRiskAssessmentProgress,
      name: <FormattedMessage id="eto.form-progress-widget.eto-settings.risk-assessment" />,
      testingId: "eto-progress-widget-risk-assessment",
      hidden: true,
    },
  ];

  const companySectionsGroup = {
    name: <FormattedMessage id="eto.form-progress-widget.company-information" />,
    sections: companySections,
  };

  const etoSectionGroup = {
    name: <FormattedMessage id="eto.form-progress-widget.eto-settings" />,
    sections: etoSections,
  };

  const groups = [companySectionsGroup, ...(shouldViewEtoSettings ? [etoSectionGroup] : [])];

  return (
    <>
      {groups.map((group, groupIndex) => (
        <Container key={groupIndex} columnSpan={EColumnSpan.THREE_COL}>
          <Heading level={2} decorator={false} className="mb-3">
            {group.name}
          </Heading>
          <Container type={EContainerType.INHERIT_GRID} className={styles.progressSectionLayout}>
            {group.sections
              .filter(s => !s.hidden)
              .map((section, sectionIndex) => (
                <EtoFormProgressWidget
                  isLoading={loadingData}
                  to={(etoRegisterRoutes as IEtoRegisteredRoutes)[section.id]}
                  progress={shouldEtoDataLoad ? section.progress : 0}
                  disabled={!shouldEtoDataLoad}
                  name={section.name}
                  readonly={etoFormIsReadonly(section.id, etoStatus)}
                  data-test-id={section.testingId}
                  key={sectionIndex}
                />
              ))}
          </Container>
        </Container>
      ))}
    </>
  );
};

export const ETOFormsProgressSection = appConnect<IStateProps, {}, IExternalProps>({
  stateToProps: state => ({
    etoStatus: selectIssuerEtoState(state),
    loadingData: selectIsGeneralEtoLoading(state),
    shouldEtoDataLoad: userHasKycAndEmailVerified(state),
    companyInformationProgress: calculateCompanyInformationProgress(selectIssuerCompany(state)),
    etoTermsProgress: calculateEtoTermsProgress(selectIssuerEto(state)),
    etoKeyIndividualsProgress: calculateEtoKeyIndividualsProgress(selectIssuerCompany(state)),
    legalInformationProgress: calculateLegalInformationProgress(selectIssuerCompany(state)),
    productVisionProgress: calculateProductVisionProgress(selectIssuerCompany(state)),
    etoMediaProgress: calculateEtoMediaProgress(selectIssuerCompany(state)),
    etoVotingRightsProgress: calculateEtoVotingRightsProgress(selectIssuerEto(state)),
    etoEquityTokenInfoProgress: calculateEtoEquityTokenInfoProgress(selectIssuerEto(state)),
    etoRiskAssessmentProgress: calculateEtoRiskAssessmentProgress(selectIssuerCompany(state)),
    etoInvestmentTermsProgress: calculateInvestmentTermsProgress(selectIssuerEto(state)),
  }),
})(ETOFormsProgressSectionComponent);
