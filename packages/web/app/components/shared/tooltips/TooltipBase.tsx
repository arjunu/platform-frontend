import * as cn from "classnames";
import * as React from "react";
import { Tooltip, TooltipProps } from "reactstrap";

import { symbols } from "../../../di/symbols";
import { ILogger } from "../../../lib/dependencies/logger";
import { noopLogger } from "../../../lib/dependencies/logger/index";
import { ContainerContext } from "../../../utils/InversifyProvider";

import * as styles from "./TooltipBase.module.scss";

export enum ECustomTooltipTextPosition {
  CENTER = styles.tooltipTextCenter,
  LEFT = styles.tooltipTextLeft,
}

interface IProps {
  textPosition?: ECustomTooltipTextPosition;
}

interface IState {
  tooltipOpen: boolean;
}

export class TooltipBase extends React.Component<
  IProps & TooltipProps<{ hideArrow?: boolean }>,
  IState
> {
  static contextType = ContainerContext;
  context!: React.ContextType<typeof ContainerContext> | undefined;

  static defaultProps = {
    textPosition: ECustomTooltipTextPosition.CENTER,
  };

  state = {
    tooltipOpen: this.props.isOpen || false,
  };

  logger: ILogger = this.context ? this.context.get<ILogger>(symbols.logger) : noopLogger;

  toggle = () => {
    if (!this.props.isOpen) {
      this.setState((s: IState) => ({ tooltipOpen: !s.tooltipOpen }));
    }
  };

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // this function should not be called, but just in case
    // if some errors occurs, it will not crash the whole application any more
    // prevents a reactstrap tooltip bug where target dom node is not found

    // tslint:disable-next-line:no-console
    this.logger.error("Fatal tooltip error", error, info);
    // trigger a rerender to update current dom
    // this prevents errors where the id in the target dom node has changed dynamically
    this.setState({ tooltipOpen: this.state.tooltipOpen });
  }

  render(): React.ReactChild {
    const { target, className, textPosition, isOpen, toggle, children, ...props } = this.props;

    // Enzyme is not working with bootstrap tooltip
    // see https://github.com/reactstrap/reactstrap/issues/818
    if (process.env.NF_MOCHA_RUN === "1") {
      return <>{children}</>;
    }

    return (
      <Tooltip
        innerClassName={styles.tooltipInner}
        className={cn(styles.tooltip, textPosition, className)}
        target={target}
        autohide={false}
        isOpen={this.state.tooltipOpen}
        toggle={this.toggle}
        {...props}
      >
        {children}
      </Tooltip>
    );
  }
}
