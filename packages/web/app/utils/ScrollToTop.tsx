import * as React from "react";
import { RouteProps } from "react-router";

import { appConnect } from "../store";

class ScrollToTopComponent extends React.Component<RouteProps> {
  componentDidUpdate(prevProps: RouteProps): void {
    if (
      prevProps.location!.pathname !== this.props.location!.pathname &&
      // TODO: Not a proper solution but will work for now
      // In general we should apply `ScrollToTop` only to root routes (the one declared in `AppRoutes`)
      !(this.props.location!.state && this.props.location!.state.scrollToTop === "prevent")
    ) {
      window.scrollTo(0, 0);
    }

    if (this.props.location!.hash && prevProps.location!.hash !== this.props.location!.hash) {
      const element = document.querySelector(this.props.location!.hash);

      // TODO: Add some pooling in case element not found for let's say a second
      //       in case there is some async work in progress
      // check if it's not an SVG which may also be returned from `querySelector`
      if (element && element instanceof HTMLElement) {
        element.scrollIntoView({
          behavior: "smooth",
        });

        element.focus();

        // it's possible that element is not focusable (e.g div)
        // in that case manually allow to receive focus and then focus again
        if (document.activeElement !== element) {
          element.setAttribute("tabindex", "-1");
          element.focus();
        }
      }
    }
  }

  render(): React.ReactNode {
    return this.props.children;
  }
}

export const ScrollToTop = appConnect({
  stateToProps: s => ({ location: s.router.location }),
})(ScrollToTopComponent);
