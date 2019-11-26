import { actions } from "../../modules/actions";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IPortfolioDownloadAgreementsModalState {
  isOpen: boolean;
  etoId?: string;
  isRetailEto?: boolean;
}

export const portfolioDownloadAgreementsModalInitialState: IPortfolioDownloadAgreementsModalState = {
  isOpen: false,
  etoId: undefined,
  isRetailEto: undefined,
};

export const portfolioDownloadAgreementsModalReducer: AppReducer<IPortfolioDownloadAgreementsModalState> = (
  state = portfolioDownloadAgreementsModalInitialState,
  action,
): DeepReadonly<IPortfolioDownloadAgreementsModalState> => {
  switch (action.type) {
    case actions.portfolio.showDownloadAgreementModal.getType(): {
      return {
        isOpen: true,
        etoId: action.payload.etoId,
        isRetailEto: action.payload.isRetailEto,
      };
    }
    case actions.portfolio.hideDownloadAgreementModal.getType(): {
      return portfolioDownloadAgreementsModalInitialState;
    }
  }

  return state;
};
