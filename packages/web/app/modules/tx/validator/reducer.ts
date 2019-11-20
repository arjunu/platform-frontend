import { AppReducer } from "../../../store";
import { actions } from "../../actions";

export enum EValidationState {
  VALIDATING = "validation",
  NOT_ENOUGH_ETHER_FOR_GAS = "not_enough_ether_for_gas",
  NOT_ENOUGH_TOKENS = "not_enough_token",
  VALIDATION_OK = "validation_ok",
  PARTIALLY_OK = "validation_partially_ok",
  IS_NOT_ACCEPTING_ETHER = "is_not_accepting_ether",
  OUTDATED = "outdated",
}
export enum EAdditionalValidationDataNotifications {
  IS_SMART_CONTRACT = "is_smart_contract",
  IS_NEW_ADDRESS = "is_new_address",
  IS_NEW_ADDRESS_WITH_BALANCE = "is_new_address_with_balance",
  WILL_EMPTY_WALLET = "will_empty_wallet",
  IS_VERIFIED_PLATFORM_USER = "is_verified_platform_usef",
}
interface ITxValidatorState {
  validationState: EValidationState | undefined;
  notifications: ReadonlyArray<EAdditionalValidationDataNotifications>;
}

const initialState: ITxValidatorState = {
  validationState: undefined,
  notifications: [],
};

export const txValidatorReducer: AppReducer<ITxValidatorState> = (
  state = initialState,
  action,
): ITxValidatorState => {
  switch (action.type) {
    case actions.txValidator.setValidationState.getType():
      return {
        ...state,
        validationState: action.payload.validationState,
      };
    case actions.txValidator.validateDraft.getType():
      return {
        ...state,
        validationState: undefined,
      };
    case actions.txValidator.clearValidationState.getType():
      return initialState;
    case actions.txValidator.setValidationNotifications.getType():
      return {
        ...state,
        notifications: action.payload,
      };
  }

  return state;
};
