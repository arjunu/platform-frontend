import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { OmitKeys } from "../../../../types";
import { NATIONALITIES } from "../../../../utils/enums/countriesEnum";
import { FormSelectField, NONE_KEY } from "./FormSelectField";

const VALUES = {
  [NONE_KEY]: <FormattedMessage id="form.select.please-select" />,
  ...NATIONALITIES,
};

type TExternalProps = OmitKeys<React.ComponentProps<typeof FormSelectField>, "values">;

const FormSelectNationalityField: React.FunctionComponent<TExternalProps> = props => (
  <FormSelectField {...props} values={VALUES} />
);

export { FormSelectNationalityField };
