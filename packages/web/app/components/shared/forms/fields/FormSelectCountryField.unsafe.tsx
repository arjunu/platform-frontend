import { FieldAttributes } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Dictionary, TTranslatedString } from "../../../../types";
import { COUNTRIES } from "../../../../utils/enums/countriesEnum";
import { FormSelectField, NONE_KEY } from "./FormSelectField";

const VALUES: Dictionary<TTranslatedString> = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  ...COUNTRIES,
};

interface IFieldGroup {
  label?: string;
  "data-test-id"?: string;
}

type FieldGroupProps = IFieldGroup & FieldAttributes<any>;

const FormSelectCountryField: React.FunctionComponent<FieldGroupProps> = props => (
  <FormSelectField {...props} values={VALUES} />
);

export { FormSelectCountryField, VALUES };
