import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EETOStateOnChain } from "../../../../../modules/eto/types";
import { generalStateToName } from "../../../shared/ETOState";

type TExternalProps = { nextState: EETOStateOnChain };

const StartDateNotSet: React.FunctionComponent<TExternalProps> = ({ nextState }) => {
  const stateName = generalStateToName[nextState];

  return (
    <p className="text-center m-0">
      <FormattedMessage
        id="shared-component.eto-overview.waiting-for-start-date-to-set"
        values={{ stateName }}
      />
    </p>
  );
};

export { StartDateNotSet };
