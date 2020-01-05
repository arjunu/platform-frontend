import { createActionFactory } from "@neufund/shared";

export const fullPageLoadingActions = {
  showFullPageLoading: createActionFactory("FULL_PAGE_LOADING_SHOW"),
  hideFullPageLoading: createActionFactory("FULL_PAGE_LOADING_HIDE"),
};
