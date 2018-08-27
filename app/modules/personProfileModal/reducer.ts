import { ISocialProfile } from "../../components/shared/SocialProfilesEditor";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IPersonProfileModalState {
  isOpen: boolean;
  personProfileModalObj?: IPersonProfileModal;
}

export interface IPersonProfileModal {
  image: string;
  name: string | React.ReactNode;
  role: string | React.ReactNode;
  description: string | React.ReactNode;
  socialChannels: ISocialProfile[];
  website: string;
}

const initialState: IPersonProfileModalState = {
  isOpen: false,
};

export const personProfileModalReducer: AppReducer<IPersonProfileModalState> = (
  state = initialState,
  action,
): DeepReadonly<IPersonProfileModalState> => {
  switch (action.type) {
    case "PERSON_PROFILE_MODAL_SHOW":
      return {
        ...state,
        isOpen: true,
        personProfileModalObj: action.payload,
      };
    case "PERSON_PROFILE_MODAL_HIDE":
      return {
        ...state,
        personProfileModalObj: undefined,
        isOpen: false,
      };
  }

  return state;
};

export const selectIsOpen = (state: IPersonProfileModalState): boolean => state.isOpen;
export const selectPersonProfileModalObj = (
  state: IPersonProfileModalState,
): IPersonProfileModal | undefined => state.personProfileModalObj;
