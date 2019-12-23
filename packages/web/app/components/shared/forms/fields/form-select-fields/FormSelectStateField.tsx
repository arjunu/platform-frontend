import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { Dictionary, OmitKeys, TTranslatedString } from "../../../../../types";
import { US_STATES } from "../../../../../utils/enums/usStatesEnum";
import { FormSelectField, NONE_KEY } from "./FormSelectField";

const VALUES: Dictionary<TTranslatedString> = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  ...US_STATES,
};

type TExternalProps = OmitKeys<React.ComponentProps<typeof FormSelectField>, "values">;

const FormSelectStateField: React.FunctionComponent<TExternalProps> = props => (
  <FormSelectField {...props} values={VALUES} />
);

export { FormSelectStateField };
