import { EtoEquityTokenInfoType } from "../../../../lib/api/eto/EtoApi.interfaces.unsafe";
import * as YupTS from "../../../../lib/yup-ts.unsafe";

const InvestmentAdditionalDataEtoSchema = YupTS.object({
  etoId: YupTS.string(),
  companyName: YupTS.string(),
  equityTokensPerShare: YupTS.number(),
  sharePrice: YupTS.number(),
  equityTokenInfo: EtoEquityTokenInfoType,
});

export const InvestmentAdditionalDataSchema = YupTS.object({
  eto: InvestmentAdditionalDataEtoSchema,
  equityTokens: YupTS.string(),
  estimatedReward: YupTS.string(),
  etherPriceEur: YupTS.string(),
  gasCostEth: YupTS.string(),
  investmentEth: YupTS.string(),
  investmentEur: YupTS.string(),
  isIcbm: YupTS.boolean(),
});

export type TInvestmentAdditionalData = YupTS.TypeOf<typeof InvestmentAdditionalDataSchema>;
