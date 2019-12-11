import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps, TTranslatedString } from "../../types";
import { NavLinkConnected } from "../../utils/react-connected-components/connectedRouting";

import * as styles from "./Tabs.module.scss";

type TComponent = React.ReactElement<ITabContent>;

interface ITabsProps {
  children: (TComponent | boolean | undefined)[];
  selectedIndex?: number;
  layoutSize?: "small" | "large";
  layoutOrnament?: boolean;
  layoutPosition?: "left" | "center" | "right";
}

interface ITabContent {
  routerPath?: string;
  tab: TTranslatedString;
  "data-test-id"?: string;
}

class TabContent extends React.Component<ITabContent> {
  public tab = this.props.tab;
  public routerPath = this.props.routerPath;
  public "data-test-id" = this.props["data-test-id"];

  render(): React.ReactNode {
    return <div>{this.props.children}</div>;
  }
}

class Tabs extends React.Component<ITabsProps & CommonHtmlProps> {
  state = {
    activeIndex: this.props.selectedIndex || 0,
  };

  static defaultProps = {
    layoutSize: "small",
    layoutOrnament: true,
    layoutPosition: "left",
  };

  private handleClick = (index: number) => {
    this.setState({ activeIndex: index });
  };

  private renderTab = (index: number, tabContent: TComponent) => {
    const { layoutSize, layoutOrnament } = this.props;

    const className = cn(styles.tab, layoutSize, {
      "has-ornament": layoutOrnament,
    });

    const commonProps = {
      onClick: () => this.handleClick(index),
      "data-test-id": tabContent && tabContent.props["data-test-id"],
    };

    return tabContent.props.routerPath ? (
      <NavLinkConnected
        {...commonProps}
        key={tabContent.props.routerPath}
        className={className}
        activeClassName="is-active"
        to={{
          pathname: tabContent.props.routerPath,
          search: window.location.search,
          state: { scrollToTop: "prevent" },
        }}
        exact={true}
      >
        {tabContent.props.tab}
      </NavLinkConnected>
    ) : (
      // TODO: Change to buttons
      <div
        {...commonProps}
        className={cn(className, {
          "is-active": index === this.state.activeIndex,
        })}
        key={index}
      >
        {tabContent.props.tab}
      </div>
    );
  };

  render(): React.ReactNode {
    const { children, layoutSize, layoutPosition, className } = this.props;
    const { activeIndex } = this.state;

    // During props destruction TS loses correct typing cast to TComponent array is required
    const tabs = React.Children.toArray(children).filter(React.isValidElement) as TComponent[];

    if (!tabs) {
      return null;
    }

    return (
      <>
        <div className={cn(styles.tabsWrapper, layoutSize, className)}>
          <div className={cn(styles.tabsOverflowWrapper, layoutPosition)}>
            {tabs.map((child: TComponent, index: number) => this.renderTab(index, child))}
          </div>
        </div>
        {tabs[activeIndex]}
      </>
    );
  }
}

export { TabContent, Tabs };
