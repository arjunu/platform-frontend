import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { setDisplayName } from "recompose";
import { compose } from "redux";

import {
  EtoEquityTokenInfoType,
  TPartialEtoSpecData,
} from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import { etoFormIsReadonly } from "../../../../lib/api/eto/EtoApiUtils";
import { actions } from "../../../../modules/actions";
import {
  selectIssuerEto,
  selectIssuerEtoLoading,
  selectIssuerEtoSaving,
  selectIssuerEtoState,
} from "../../../../modules/eto-flow/selectors";
import { EEtoFormTypes } from "../../../../modules/eto-flow/types";
import { appConnect } from "../../../../store";
import { Button, EButtonLayout } from "../../../shared/buttons";
import { FormField } from "../../../shared/forms";
import { FormFieldLabel } from "../../../shared/forms/fields/FormFieldLabel";
import { FormSingleFileUpload } from "../../../shared/forms/fields/FormSingleFileUpload.unsafe";
import { EMimeType } from "../../../shared/forms/fields/utils.unsafe";
import { EtoFormBase } from "../EtoFormBase";
import { Section } from "../Shared";

import * as styles from "../Shared.module.scss";

interface IExternalProps {
  readonly: boolean;
}

interface IStateProps {
  loadingData: boolean;
  savingData: boolean;
  stateValues: TPartialEtoSpecData;
}

interface IDispatchProps {
  saveData: (values: TPartialEtoSpecData) => void;
}

type IProps = IExternalProps & IStateProps & IDispatchProps;

const EtoEquityTokenInfoComponent: React.FunctionComponent<IProps> = ({
  readonly,
  savingData,
  stateValues,
  saveData,
}) => (
  <EtoFormBase
    title={<FormattedMessage id="eto.form.eto-equity-token-info.title" />}
    validationSchema={EtoEquityTokenInfoType.toYup()}
    initialValues={stateValues}
    onSubmit={saveData}
  >
    <Section>
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-name" />}
        placeholder="Token name should be associated with your company’s brand name or project"
        name="equityTokenName"
        disabled={readonly}
      />
      <FormField
        label={<FormattedMessage id="eto.form.section.equity-token-information.token-symbol" />}
        placeholder="Token symbol should be a short version of the token name (max. 3-4 characters)"
        maxLength="4"
        name="equityTokenSymbol"
        disabled={readonly}
      />
      <div className="form-group">
        <FormFieldLabel name="equityTokenImage">
          <FormattedMessage id="eto.form.section.equity-token-information.token-image" />
        </FormFieldLabel>
        <FormSingleFileUpload
          label={<FormattedMessage id="eto.form.section.equity-token-information.token-icon" />}
          name="equityTokenImage"
          acceptedFiles={[EMimeType.PNG, EMimeType.JPG]}
          fileFormatInformation="*200 x 200px png"
          dimensions={{ width: 200, height: 200 }}
          data-test-id="eto-registration-token-logo"
          disabled={readonly}
        />
      </div>
    </Section>

    {!readonly && (
      <Section className={styles.buttonSection}>
        <Button
          layout={EButtonLayout.OUTLINE}
          type="submit"
          isLoading={savingData}
          data-test-id="eto-registration-token-info-submit"
        >
          <FormattedMessage id="form.button.save" />
        </Button>
      </Section>
    )}
  </EtoFormBase>
);

const EtoEquityTokenInfo = compose<React.FunctionComponent<IExternalProps>>(
  setDisplayName(EEtoFormTypes.EtoEquityTokenInfo),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      loadingData: selectIssuerEtoLoading(s),
      savingData: selectIssuerEtoSaving(s),
      stateValues: selectIssuerEto(s) as TPartialEtoSpecData,
      readonly: etoFormIsReadonly(EEtoFormTypes.EtoEquityTokenInfo, selectIssuerEtoState(s)),
    }),
    dispatchToProps: dispatch => ({
      saveData: (eto: TPartialEtoSpecData) => {
        dispatch(actions.etoFlow.saveEtoStart(eto));
      },
    }),
  }),
)(EtoEquityTokenInfoComponent);

export { EtoEquityTokenInfoComponent, EtoEquityTokenInfo };
