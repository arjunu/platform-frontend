import { minutesToMs } from "@neufund/shared"

import { EJurisdiction } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { ECountries } from "../../utils/enums/countriesEnum";

export const etoInProgressPollingDelay = minutesToMs(1);
export const etoNormalPollingDelay = minutesToMs(10);

// {USER_JURISDICTION: [Array of jurisdictions that should be hidden]}
export const hiddenJurisdictions: { [key: string]: EJurisdiction[] } = {
  [ECountries.LIECHTENSTEIN]: [EJurisdiction.GERMANY],
};
