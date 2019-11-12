import { MONEY_DECIMALS } from "../../config/constants";
import { TBigNumberVariants } from "../../lib/web3/types";
import { formatMoney } from "../../utils/MoneyUtils";
import { ECurrency, ENumberInputFormat, ERoundingMode } from "./formatters/utils";

const selectDecimalPlaces = (currency: ECurrency, isPrice?: boolean): number => {
  if (isPrice) {
    return 8;
  }

  switch (currency) {
    case ECurrency.ETH:
    case ECurrency.NEU:
      return 4;
    case ECurrency.EUR:
    case ECurrency.EUR_TOKEN:
      return 2;
  }
};

/*
 * @deprecated
 * */
function getFormatDecimals(format: ENumberInputFormat): number {
  switch (format) {
    case ENumberInputFormat.ULPS:
      return MONEY_DECIMALS;
    case ENumberInputFormat.FLOAT:
      return 0;
    default:
      throw new Error("Unsupported money format");
  }
}
/*
 * @deprecated
 * Use app/components/shared/formatters/Money or app/components/shared/formatters/FormatNumber
 * */
export function getFormattedMoney(
  value: TBigNumberVariants,
  currency: ECurrency,
  format: ENumberInputFormat,
  isPrice?: boolean,
  roundingMode?: ERoundingMode,
): string {
  return formatMoney(
    value,
    getFormatDecimals(format),
    selectDecimalPlaces(currency, isPrice),
    roundingMode,
  );
}

export { selectDecimalPlaces };
