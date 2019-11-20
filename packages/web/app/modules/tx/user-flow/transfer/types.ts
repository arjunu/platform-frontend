export type TxUserFlowTransferDetails = {
  transferAllValue?: string;
  inputValue: string;
  inputValueEuro: string;
  inputTo?: string;
  totalValue: string;
  totalValueEur: string;
  transactionCost: string;
  transactionCostEur: string;
};

export type TxUserFlowInputData = {
  to: string;
  value: string;
};
