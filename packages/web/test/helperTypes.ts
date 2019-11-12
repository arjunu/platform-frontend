export interface IWindowData {
  payoutRequiredAmount?: string;
  disableNotAcceptingEtherCheck?: boolean;
  forceLowGas?: boolean;
  forceStandardGas?: boolean;
  nfISHAConfidentialityAgreementsRequirements?: string;
}

export type IWindowWithData = IWindowData & Window;
