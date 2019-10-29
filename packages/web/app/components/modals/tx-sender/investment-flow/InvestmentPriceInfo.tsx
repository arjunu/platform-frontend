import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EETOStateOnChain, IEtoTokenGeneralDiscounts } from "../../../../modules/eto/types";
import { IPersonalDiscount } from "../../../../modules/investor-portfolio/types";
import { convertFromUlps, isZero } from "../../../../utils/NumberUtils";
import { Money } from "../../../shared/formatters/Money";
import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  EPriceFormat,
} from "../../../shared/formatters/utils";
import { Percentage } from "../../../shared/Percentage";

interface IExternalProps {
  onChainState: EETOStateOnChain;
  etoTokenGeneralDiscounts: IEtoTokenGeneralDiscounts;
  etoTokenPersonalDiscount: IPersonalDiscount;
  etoTokenStandardPrice: number;
}

const InvestmentPriceInfo: React.FunctionComponent<IExternalProps> = ({
  onChainState,
  etoTokenPersonalDiscount,
  etoTokenGeneralDiscounts,
  etoTokenStandardPrice,
}) => {
  switch (onChainState) {
    case EETOStateOnChain.Whitelist: {
      // do not show personal discount if the amount left is less than 1 cent
      const isTherePersonalWhitelistDiscount = convertFromUlps(
        etoTokenPersonalDiscount.whitelistDiscountAmountLeft,
      ).greaterThanOrEqualTo("0.01");
      const isThereGeneralWhitelistDiscount = !isZero(
        etoTokenGeneralDiscounts.whitelistDiscountFrac.toString(),
      );

      if (isTherePersonalWhitelistDiscount) {
        return (
          <>
            <FormattedMessage
              id="investment-flow.token-price-info.personal-discount"
              values={{
                whitelistDiscountAmountLeft: (
                  <Money
                    data-test-id="investment-flow.token-price.personal-discount.amount-left"
                    value={etoTokenPersonalDiscount.whitelistDiscountAmountLeft}
                    inputFormat={ENumberInputFormat.ULPS}
                    valueType={ECurrency.EUR}
                    outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS_ROUND_UP}
                  />
                ),
                whitelistDiscount: (
                  <Money
                    data-test-id="investment-flow.token-price.personal-discount.price"
                    value={etoTokenPersonalDiscount.whitelistDiscountUlps}
                    inputFormat={ENumberInputFormat.ULPS}
                    valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                    outputFormat={ENumberOutputFormat.FULL}
                  />
                ),
                whitelistDiscountPercentage: (
                  <Percentage data-test-id="investment-flow.token-price.personal-discount.discount">
                    {etoTokenPersonalDiscount.whitelistDiscountFrac}
                  </Percentage>
                ),
              }}
            />{" "}
            {isThereGeneralWhitelistDiscount ? (
              <FormattedMessage
                id="investment-flow.token-price-info.personal-discount.general-discount"
                values={{
                  discountTokenPrice: (
                    <Money
                      data-test-id="investment-flow.token-price.personal-discount.general-discount.price"
                      value={etoTokenGeneralDiscounts.whitelistDiscountUlps}
                      inputFormat={ENumberInputFormat.ULPS}
                      valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                      outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                    />
                  ),
                  discountTokenPricePercentage: (
                    <Percentage data-test-id="investment-flow.token-price.personal-discount.general-discount.discount">
                      {etoTokenGeneralDiscounts.whitelistDiscountFrac}
                    </Percentage>
                  ),
                }}
              />
            ) : (
              <FormattedMessage
                id="investment-flow.token-price-info.personal-discount.no-discount"
                values={{
                  tokenPriceEur: (
                    <Money
                      value={etoTokenStandardPrice.toString()}
                      inputFormat={ENumberInputFormat.FLOAT}
                      valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                      outputFormat={ENumberOutputFormat.FULL}
                    />
                  ),
                }}
              />
            )}
          </>
        );
      }

      if (isThereGeneralWhitelistDiscount) {
        return (
          <FormattedMessage
            id="investment-flow.token-price-info.general-discount"
            values={{
              discountTokenPrice: (
                <Money
                  data-test-id="investment-flow.token-price.whitelist-discount.price"
                  value={etoTokenGeneralDiscounts.whitelistDiscountUlps}
                  inputFormat={ENumberInputFormat.ULPS}
                  valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                  outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                />
              ),
              discountTokenPricePercentage: (
                <Percentage data-test-id="investment-flow.token-price.whitelist-discount.discount">
                  {etoTokenGeneralDiscounts.whitelistDiscountFrac}
                </Percentage>
              ),
            }}
          />
        );
      }

      return (
        <FormattedMessage
          id="investment-flow.token-price-info.no-discount"
          values={{
            tokenPriceEur: (
              <Money
                value={etoTokenStandardPrice.toString()}
                inputFormat={ENumberInputFormat.FLOAT}
                valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                outputFormat={ENumberOutputFormat.FULL}
              />
            ),
          }}
        />
      );
    }
    case EETOStateOnChain.Public:
      if (!isZero(etoTokenGeneralDiscounts.publicDiscountFrac.toString())) {
        return (
          <FormattedMessage
            id="investment-flow.token-price-info.general-discount"
            values={{
              discountTokenPrice: (
                <Money
                  value={etoTokenGeneralDiscounts.publicDiscountUlps}
                  inputFormat={ENumberInputFormat.ULPS}
                  valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                  outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
                />
              ),
              discountTokenPricePercentage: (
                <Percentage>{etoTokenGeneralDiscounts.publicDiscountFrac}</Percentage>
              ),
            }}
          />
        );
      }

      return (
        <FormattedMessage
          id="investment-flow.token-price-info.no-discount"
          values={{
            tokenPriceEur: (
              <Money
                data-test-id="investment-flow.token-price.no-discount.price"
                value={etoTokenStandardPrice.toString()}
                inputFormat={ENumberInputFormat.FLOAT}
                valueType={EPriceFormat.EQUITY_TOKEN_PRICE_EURO}
                outputFormat={ENumberOutputFormat.FULL}
              />
            ),
          }}
        />
      );
    default:
      throw new Error(
        `Eto on chain state should be either ${EETOStateOnChain.Whitelist} or ${
          EETOStateOnChain.Public
        }, received ${onChainState}`,
      );
  }
};

export { InvestmentPriceInfo };
