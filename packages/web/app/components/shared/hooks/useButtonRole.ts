import * as React from "react";

import { EKeys } from "../../../utils/enums/keysEnum";

/**
 * Returns props that should be applied to element that needs to be focusable/clickable.
 * Always prefer to use normal buttons over this hook when possible.
 * Use this as a last resort (for e.g. when you need to have clickable table rows.
 *
 * @return Object with `role` set to button and `tabIndex`, `onClick`, `onKeyDown` to make it accessible.
 *  If `onClick` param is undefined returns empty object
 */
const useButtonRole = <T>(
  onClick: ((event: React.KeyboardEvent<T> | React.MouseEvent<T>) => void) | undefined,
) =>
  React.useMemo(() => {
    if (onClick) {
      return {
        tabIndex: 0,
        role: "button",
        onClick,
        onKeyDown: (event: React.KeyboardEvent<T>) => {
          // Check to see if space or enter were pressed
          if (event.key === EKeys.SPACE || event.key === EKeys.ENTER) {
            // Prevent the default action to stop scrolling when space is pressed
            event.preventDefault();
            onClick(event);
          }
        },
      };
    }

    // in case onClick was not provided return empty props
    return {};
  }, [onClick]);

export { useButtonRole };
