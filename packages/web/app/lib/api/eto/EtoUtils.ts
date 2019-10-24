import { TPartialEtoSpecData } from "./EtoApi.interfaces.unsafe";
import { convertPercentageToFraction, parseStringToFloat } from "../../../components/eto/utils";

export const calcInvestmentAmount = (eto: TPartialEtoSpecData, sharePrice: number | undefined) => ({
  minInvestmentAmount: calcMaxInvestmentAmount(sharePrice, eto.minimumNewSharesToIssue),
  maxInvestmentAmount: calcMaxInvestmentAmountWithDiscount(eto, sharePrice, eto.newSharesToIssue),
});

export const calcNumberOfTokens = ({
  preMoneyValuationEur = 0,
  existingShareCapital = 0,
  newShareNominalValue = 1,
  newSharesToIssue = 1,
  minimumNewSharesToIssue = 0,
}: TPartialEtoSpecData) => {
  let computedMaxNumberOfTokens = 0;
  let computedMinNumberOfTokens = 0;
  const sharePrice = calcSharePrice({
    preMoneyValuationEur,
    existingShareCapital,
    newShareNominalValue,
  });
  if (sharePrice > 0) {
    const equityTokensPerShare = calcTokensPerShareFromSharePrice(sharePrice);
    computedMaxNumberOfTokens = newSharesToIssue * equityTokensPerShare;
    computedMinNumberOfTokens = minimumNewSharesToIssue * equityTokensPerShare;
  }
  return { computedMaxNumberOfTokens, computedMinNumberOfTokens };
};

export const calcCapFraction = ({
  newSharesToIssue = 1,
  minimumNewSharesToIssue = 0,
  existingShareCapital = 1,
  newShareNominalValue = 1,
}: TPartialEtoSpecData) => {
  if(existingShareCapital > 0){
    return ({
      computedMaxCapPercent: ((newSharesToIssue * newShareNominalValue) / existingShareCapital) * 100,
      computedMinCapPercent:
        ((minimumNewSharesToIssue * newShareNominalValue) / existingShareCapital) * 100,
    })
  } else {
    throw new Error("Existing share capital cannot be 0");
  }
};

export const calcShareAndTokenPrice = ({
  preMoneyValuationEur = 0,
  existingShareCapital = 0,
  newShareNominalValue = 1,
}: TPartialEtoSpecData) => {
  let tokenPrice = 0;
  let tokensPerShare = 0;
  const sharePrice = calcSharePrice({
    preMoneyValuationEur,
    existingShareCapital,
    newShareNominalValue,
  });
  if (sharePrice > 0) {
    tokensPerShare = calcTokensPerShareFromSharePrice(sharePrice);
    tokenPrice = tokensPerShare !== 0 ? sharePrice / tokensPerShare : 0;
  }
  console.log("sharePrice", sharePrice,
    "tokenPrice", tokenPrice,
    "tokensPerShare", tokensPerShare,)
  return {
    sharePrice,
    tokenPrice,
    tokensPerShare,
  };
};

export const calcSharePrice = ({
  preMoneyValuationEur = 0,
  existingShareCapital = 0,
  newShareNominalValue = 1,
}: TPartialEtoSpecData) => {
  let sharePrice = 0;
  if (existingShareCapital !== 0) {
    sharePrice = (preMoneyValuationEur * newShareNominalValue) / existingShareCapital;
  }
  return sharePrice;
};

const calcTokensPerShareFromSharePrice = (sharePrice: number) => {
  console.log('calcTokensPerShareFromSharePrice, sharePrice', sharePrice)
  let tokensPerShare;
  const sharePriceLog = Math.log10(sharePrice);
  console.log('calcTokensPerShareFromSharePrice, sharePriceLog', sharePriceLog)
  if (sharePriceLog < 0) {
    tokensPerShare = 0;
  } else {
    let powers = Math.floor(sharePriceLog);
    // for powers of 10 keep be inclusive to previous divisor so we can have 1 EUR token price
    if (powers === sharePriceLog) {
      powers -= 1;
    }
    tokensPerShare = Math.pow(10, powers + 1);
  }

  console.log('calcTokensPerShareFromSharePrice, tokensPerShare', tokensPerShare)
  return tokensPerShare;
};

const calcMaxInvestmentAmountWithDiscount = (
  {
    newSharesToIssueInFixedSlots = 0,
    newSharesToIssueInWhitelist = 0,
    fixedSlotsMaximumDiscountFraction = 0,
    whitelistDiscountFraction = 0,
    publicDiscountFraction = 0,
  }: TPartialEtoSpecData,
  sharePrice = 0,
  shares = 0,
) => {
  if (sharePrice === 0 || shares === 0) {
    return 0;
  }

  if (
    fixedSlotsMaximumDiscountFraction > 1 ||
    whitelistDiscountFraction > 1 ||
    publicDiscountFraction > 1
  ) {
    throw new Error("Fraction number is required instead of percentage value");
  }

  let amount = 0;

  if (fixedSlotsMaximumDiscountFraction > 0 && shares > 0) {
    const minShares = Math.min(newSharesToIssueInFixedSlots, shares);

    amount += minShares * sharePrice * (1 - fixedSlotsMaximumDiscountFraction);
    shares -= minShares;
  }

  if (whitelistDiscountFraction > 0 && shares > 0) {
    const minShares = Math.min(newSharesToIssueInWhitelist, shares);

    amount += minShares * sharePrice * (1 - whitelistDiscountFraction);
    shares -= minShares;
  }

  if (shares > 0) {
    amount += shares * sharePrice * (1 - publicDiscountFraction);
  }

  return amount;
};

const calcMaxInvestmentAmount = (sharePrice = 0, shares = 0) => {
  if (sharePrice === 0 || shares === 0) {
    return 0;
  }
  return shares * sharePrice;
};

export const calculateInvestmentValues = (calculatorValues) => {
  const { sharePrice, tokenPrice, tokensPerShare } = calcShareAndTokenPrice(calculatorValues);
  const { computedMaxNumberOfTokens, computedMinNumberOfTokens } = calcNumberOfTokens(calculatorValues);
  const { computedMaxCapPercent, computedMinCapPercent } = calcCapFraction(calculatorValues);
  const { minInvestmentAmount, maxInvestmentAmount } = calcInvestmentAmount(calculatorValues, sharePrice);

  return {
    sharePrice,
    tokensPerShare,
    tokenPrice,
    minInvestmentAmount,
    maxInvestmentAmount,
    computedMinNumberOfTokens,
    computedMaxNumberOfTokens,
    computedMinCapPercent,
    computedMaxCapPercent,
  }
};

export const convertAndValidateCalculatorValues = (rawValues) => {
  const fixedSlotsMaximumDiscountFraction = parseStringToFloat()(
    rawValues.fixedSlotsMaximumDiscountFraction,
  );
  const whitelistDiscountFraction = parseStringToFloat()(rawValues.whitelistDiscountFraction);
  const publicDiscountFraction = parseStringToFloat()(rawValues.publicDiscountFraction);

  return {
    newSharesToIssue: parseStringToFloat()(rawValues.newSharesToIssue),
    minimumNewSharesToIssue: parseStringToFloat()(rawValues.minimumNewSharesToIssue),
    existingShareCapital: parseStringToFloat()(rawValues.existingShareCapital),
    newShareNominalValue: parseStringToFloat()(rawValues.newShareNominalValue),
    preMoneyValuationEur: parseStringToFloat()(rawValues.preMoneyValuationEur),
    newSharesToIssueInFixedSlots: parseStringToFloat()(rawValues.newSharesToIssueInFixedSlots),
    newSharesToIssueInWhitelist: parseStringToFloat()(rawValues.newSharesToIssueInWhitelist),
    fixedSlotsMaximumDiscountFraction: fixedSlotsMaximumDiscountFraction
      ? convertPercentageToFraction()(fixedSlotsMaximumDiscountFraction)
      : 0,
    whitelistDiscountFraction: fixedSlotsMaximumDiscountFraction
      ? convertPercentageToFraction()(whitelistDiscountFraction)
      : 0,
    publicDiscountFraction: fixedSlotsMaximumDiscountFraction
      ? convertPercentageToFraction()(publicDiscountFraction)
      : 0,
  }
};
