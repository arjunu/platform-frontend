import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoRiskAssessmentType,
  TPartialCompanyEtoData,
} from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { actions } from "../../../../modules/actions";
import {
  selectIssuerCompany,
  selectIssuerEtoLoading,
  selectIssuerEtoSaving,
} from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormFieldBoolean, FormTextArea } from "../../../shared/forms";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import * as styles from "../Shared.module.scss";

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialCompanyEtoData;
}

interface IDispatchProps {
  saveData: (values: TPartialCompanyEtoData) => void;
}

type IProps = IStateProps & IDispatchProps;

const EtoRegistrationRiskAssessmentComponent = (props: IProps) => (
  <EtoFormBase
    title="Risk Assessment"
    validationSchema={EtoRiskAssessmentType.toYup()}
    initialValues={props.stateValues}
    onSubmit={props.saveData}
  >
    <Section>
      <FormTextArea
        className="my-2"
        label={<FormattedMessage id="eto.form.risk-assessment.liquidity-description" />}
        placeholder="Describe"
        name="riskLiquidityDescription"
      />

      <div className="form-group">
        <FormFieldBoolean
          name="riskNoThirdPartyDependency"
          label={<FormattedMessage id="eto.form.risk-assessment.no-third-parties" />}
          disabled={true}
        />
      </div>

      <FormTextArea
        className="my-2"
        label={<FormattedMessage id="eto.form.risk-assessment.third-parties-description" />}
        placeholder="Describe"
        name="riskThirdPartyDescription"
      />

      <FormTextArea
        className="my-2"
        label={<FormattedMessage id="eto.form.risk-assessment.third-party-financing-description" />}
        placeholder="Describe"
        name="riskThirdPartySharesFinancing"
      />

      <FormTextArea
        className="my-2"
        label={<FormattedMessage id="eto.form.risk-assessment.business-model" />}
        placeholder="Describe"
        name="riskBusinessModelDescription"
      />

      <FormTextArea
        className="my-2"
        label={<FormattedMessage id="eto.form.risk-assessment.max-risk-description" />}
        placeholder="Describe"
        name="riskMaxDescription"
      />

      <div className="form-group">
        <FormFieldBoolean
          name="riskNotRegulatedBusiness"
          label={<FormattedMessage id="eto.form.risk-assessment.no-regulation" />}
          disabled={true}
        />
      </div>

      <div className="form-group">
        <FormFieldBoolean
          name="riskNoLoansExist"
          label={<FormattedMessage id="eto.form.risk-assessment.no-loans" />}
          disabled={true}
        />
      </div>
    </Section>
    <Section className={styles.buttonSection}>
      <Button
        layout={EButtonLayout.OUTLINE}
        type="submit"
        isLoading={props.savingData}
        data-test-id="eto-registration-risk-submit"
      >
        <FormattedMessage id="form.button.save" />
      </Button>
    </Section>
  </EtoFormBase>
);

const EtoRegistrationRiskAssessment = compose<React.FunctionComponent>(
  setDisplayName(EEtoFormTypes.EtoRiskAssessment),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: selectIssuerEtoLoading(s),
      savingData: selectIssuerEtoSaving(s),
      stateValues: selectIssuerCompany(s) as TPartialCompanyEtoData,
    }),
    dispatchToProps: dispatch => ({
      saveData: (company: TPartialCompanyEtoData) => {
        dispatch(actions.etoFlow.saveCompanyStart(company));
      },
    }),
  }),
)(EtoRegistrationRiskAssessmentComponent);

export { EtoRegistrationRiskAssessmentComponent, EtoRegistrationRiskAssessment };
