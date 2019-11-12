import * as React from "react";

import { CommonHtmlProps } from "../../../types";

interface IProps {
  endDate: Date;
  onFinish?: () => void;
  timerRunningComponent: (timeLeft: number) => React.ReactElement;
  timerFinishedComponent: (timeLeft: number) => React.ReactElement;
}

interface IState {
  timeLeft: number;
}

export class TimeBasedComponentSwitcher extends React.Component<IProps & CommonHtmlProps, IState> {
  getTimeLeft = () => {
    const timeLeft = this.props.endDate.getTime() - Date.now();
    return timeLeft > 0 ? timeLeft : 0;
  };

  state = {
    timeLeft: this.getTimeLeft(),
  };

  timer: number | undefined = undefined;

  onFinish = () => {
    if (this.props.onFinish) {
      this.props.onFinish();
    }
  };

  componentDidMount(): void {
    if (process.env.STORYBOOK_RUN !== "1") {
      if (this.state.timeLeft > 0) {
        this.timer = window.setInterval(() => {
          const timeLeft = this.getTimeLeft();
          if (timeLeft === 0) {
            this.onFinish();
            window.clearInterval(this.timer);
          }
          this.setState({ timeLeft });
        }, 1000);
      } else {
        this.onFinish();
      }
    }
  }

  componentWillUnmount(): void {
    if (this.timer !== undefined) {
      window.clearInterval(this.timer);
    }
  }

  render(): React.ReactNode {
    const { timeLeft } = this.state;
    return timeLeft > 0
      ? this.props.timerRunningComponent(timeLeft)
      : this.props.timerFinishedComponent(timeLeft);
  }
}
