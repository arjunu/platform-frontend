import { SyntheticEvent } from "react";

export const dontPropagateEvent = <T extends SyntheticEvent>(handler: (e: T) => void) => (e: T) => {
  e.stopPropagation();

  handler(e);
};
