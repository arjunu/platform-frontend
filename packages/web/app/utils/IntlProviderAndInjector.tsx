import { Container } from "inversify";
import * as React from "react";
import { IntlProvider } from "react-intl";

import languageEn from "../../intl/locales/en-en.json";
import { symbols } from "../di/symbols";
import { IntlWrapper } from "../lib/intl/IntlWrapper";
import { IIntlProps, injectIntlHelpers } from "@neufund/shared"
import { ContainerContext } from "./InversifyProvider";

const IntlContainerInjector = injectIntlHelpers<{}>(
  class extends React.Component<IIntlProps> {
    static contextType = ContainerContext;
    static displayName = "IntlContainerInjector";

    context!: Container;

    componentDidMount(): void {
      this.context.get<IntlWrapper>(symbols.intlWrapper).intl = this.props.intl;
    }

    render(): React.ReactNode {
      return this.props.children;
    }
  },
);

/**
 * Provides intl to children and injects it to inversify container that should be available via context.
 */
export const IntlProviderAndInjector: React.FunctionComponent = ({ children }) => (
  // change locale to gb to have european date format everywhere
  <IntlProvider locale="en-gb" messages={languageEn} textComponent={React.Fragment}>
    <IntlContainerInjector>{children}</IntlContainerInjector>
  </IntlProvider>
);
