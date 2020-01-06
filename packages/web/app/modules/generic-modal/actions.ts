import { createActionFactory } from "@neufund/shared";
import * as React from "react";

import { TMessage } from "../../components/translatedMessages/utils";
import { createAction } from "../actionsUtils";
import { TIconType } from "./reducer";

// TODO: Refactor actions to receive single object as a parameter
export const genericModalActions = {
  // TODO: Check if it's possible to generate generic types for sub function
  showModal: <T extends { closeModal?: () => void }, P extends object = Omit<T, "closeModal">>(
    component: React.ComponentType<T>,
    props?: P,
  ) => createAction("MODAL_SHOW", { component, props }),

  showGenericModal: createActionFactory("GENERIC_MODAL_SHOW", (
    title: TMessage,
    description?: TMessage,
    icon?: TIconType,
    actionLinkText?: TMessage,
    // TODO: find circular dependency in AppActionTypes
    onClickAction?: any,
  ) => ({
    title,
    description,
    icon,
    actionLinkText,
    onClickAction,
  })),

  showInfoModal: (
    title: TMessage,
    description?: TMessage,
    actionLinkText?: TMessage,
    onClickAction?: any,
  ) =>
    genericModalActions.showGenericModal(
      title,
      description,
      "check",
      actionLinkText,
      onClickAction,
    ),

  showErrorModal: (
    title: TMessage,
    description?: TMessage,
    actionLinkText?: TMessage,
    onClickAction?: any,
  ) =>
    genericModalActions.showGenericModal(
      title,
      description,
      "exclamation",
      actionLinkText,
      onClickAction,
    ),

  hideGenericModal: createActionFactory("GENERIC_MODAL_HIDE"),
};
