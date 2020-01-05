import { createSelector } from "reselect";

import { IAppState } from "../../store";

const selectFullPageLoading = (state: IAppState) => state.fullPageLoading;

export const selectFullPageLoadingIsOpen = createSelector(
  selectFullPageLoading,
  state => state.isOpen,
);
