import { toCamelCase } from "@neufund/shared"
import * as queryString from "query-string";

import { IAppState } from "../../store";
import { isValidLink } from "./utils";

const getUnsubscriptionLinkFromQueryString = (query: string) => {
  const { confirmationUrl } = toCamelCase(queryString.parse(query, { decode: true }));

  return confirmationUrl && isValidLink(confirmationUrl) ? confirmationUrl : undefined;
};

export const selectUnsubscriptionLinkFromQueryString = (state: IAppState): string | undefined => {
  const routerState = state.router;

  if (!routerState.location) {
    return undefined;
  }

  return getUnsubscriptionLinkFromQueryString(routerState.location.search);
};
