import { TSocialChannelsType } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { TTranslatedString } from "../../types";
import { createAction, createSimpleAction } from "../actionsUtils";

export const personProfileModalActions = {
  showPersonProfileModal: (
    name: string,
    role: string,
    description: TTranslatedString,
    image: string,
    socialChannels: TSocialChannelsType,
    website?: string,
  ) =>
    createAction("PERSON_PROFILE_MODAL_SHOW", {
      name,
      role,
      description,
      socialChannels,
      image,
      website,
    }),

  hidePersonProfileModal: () => createSimpleAction("PERSON_PROFILE_MODAL_HIDE"),
};
