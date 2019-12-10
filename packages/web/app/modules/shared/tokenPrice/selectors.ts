import { ECurrency } from "../../../components/shared/formatters/utils";
import { IAppState } from "../../../store";
import { assertNever } from "@neufund/shared";
import { multiplyBigNumbers } from "../../../utils/BigNumberUtils";
import { ITokenPriceStateData } from "./reducer";

export const selectTokenPriceData = (state: IAppState): ITokenPriceStateData | undefined =>
  state.tokenPrice.tokenPriceData;

export const selectEtherPriceEur = (state: IAppState): string => {
  const data = selectTokenPriceData(state);
  return (data && data.etherPriceEur) || "0";
};

export const selectNeuPriceEur = (state: IAppState): string => {
  const data = selectTokenPriceData(state);
  return (data && data.neuPriceEur) || "0";
};

export const selectEurPriceEther = (state: IAppState): string => {
  const data = selectTokenPriceData(state);
  return (data && data.eurPriceEther) || "0";
};

export const selectEurEquivalent = (state: IAppState, amount: string, currency: ECurrency) => {
  switch (currency) {
    case ECurrency.NEU:
      return multiplyBigNumbers([selectNeuPriceEur(state), amount]);
    case ECurrency.EUR:
    case ECurrency.EUR_TOKEN:
      return amount;
    case ECurrency.ETH:
      return multiplyBigNumbers([selectEtherPriceEur(state), amount]);
    default:
      return assertNever(currency, `Not able to calculate Eur equivalent for ${currency}`);
  }
};
