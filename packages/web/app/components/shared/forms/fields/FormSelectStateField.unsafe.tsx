import { FieldAttributes } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Dictionary, TTranslatedString } from "../../../../types";
import { US_STATES } from "../../../../utils/enums/usStatesEnum";
import { FormSelectField, NONE_KEY } from "./FormSelectField";

const VALUES: Dictionary<TTranslatedString> = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  ...US_STATES,
};

interface IFieldGroup {
  label?: string;
  "data-test-id"?: string;
}

type FieldGroupProps = IFieldGroup & FieldAttributes<any>;

const FormSelectStateField: React.FunctionComponent<FieldGroupProps> = props => (
  <FormSelectField {...props} values={VALUES} />
);

export { FormSelectStateField, VALUES };
