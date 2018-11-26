import * as cn from "classnames";
import * as React from "react";
import { Tooltip, TooltipProps } from "reactstrap";

import * as styles from "./CustomTooltip.module.scss";

interface IProps {}
interface IState {
  tooltipOpen: boolean;
}

export class CustomTooltip extends React.Component<TooltipProps & IProps> {
  state: IState = {
    tooltipOpen: false,
  };

  toggle = () => {
    if (!this.props.isOpen) {
      this.setState((s: IState) => ({ tooltipOpen: !s.tooltipOpen }));
    }
  };

  componentDidMount(): void {
    if (this.props.isOpen) {
      this.setState({
        tooltipOpen: true,
      });
    }
  }

  render(): React.ReactChild {
    const { target, className, isOpen, toggle, children, ...props } = this.props;
    return (
      <Tooltip
        className={cn(styles.tooltip, className)}
        target={target}
        autohide={false}
        isOpen={this.state.tooltipOpen}
        toggle={toggle || this.toggle}
        {...props}
      >
        {children}
      </Tooltip>
    );
  }
}
