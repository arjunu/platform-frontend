import { createActionFactory } from "@neufund/shared";
import { EInvestmentInputValidationError, TInvestmentInputError, TTxUserFlowInvestmentViewData } from "./reducer";

export const txUserFlowInvestmentActions = {
  setEtoId: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_ETO_ID",
    (etoId:string)=>({etoId})
  ),
  setViewData: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_VIEW_DATA",
    (data:TTxUserFlowInvestmentViewData)=>({data})
  ),
  reset: createActionFactory("TX_USER_FLOW_INVESTMENT_RESET"  ),
  submitInvestmentValue:createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SUBMIT_VALUE",
    (value: string) => ({value})
  ),
  setInvestmentValue: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_VALUE",
    (value: string) => ({value})
  ),
  setValidationError: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_VALIDATION_ERROR",
    (error: EInvestmentInputValidationError) => ({error})
  ),
  updateValue: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_UPDATE_VALUE",
    (value: string) => ({value})
  ),
  investEntireBalance: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_INVEST_ENTIRE_BALANCE",
  ),
  setResult: createActionFactory(
    "TX_USER_FLOW_INVESTMENT_SET_RESUTL",
    (value: string, error: TInvestmentInputError) => ({value, error})
  ),
};
