import * as moment from "moment";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { calculateTimeLeft, calculateTimeLeftUnits } from "./utils";

import * as sheep from "../../assets/img/landing/rainbowsheep.gif";
import * as test_sheep from "../../assets/img/landing/test_rainbowsheep.png";
import * as styles from "./TimeLeft.module.scss";

interface ITimeLeftRefresher {
  finalTime: moment.Moment | Date;
  asUtc: boolean;
  renderComponent: React.ComponentType<ITimeLeftProps>;
}

interface ITimeLeftProps {
  timeLeft: number;
}

const RenderTimeLeft: React.ComponentType<ITimeLeftProps> = ({ timeLeft }) => {
  const [days, hours, minutes] = calculateTimeLeftUnits(timeLeft);
  return (
    <>
      {days > 0 && (
        <>
          {days} <FormattedMessage values={{ days }} id="eto.settings.days" />
          &nbsp;
        </>
      )}
      {hours > 0 && (
        <>
          {hours} <FormattedMessage values={{ hours }} id="eto.settings.hours" />
          &nbsp;
        </>
      )}
      {minutes > 0 && (
        <>
          {minutes} <FormattedMessage values={{ minutes }} id="eto.settings.minutes" />
          &nbsp;
        </>
      )}
      {timeLeft > 0 && days === 0 && hours === 0 && minutes === 0 && (
        <>
          {timeLeft} <FormattedMessage values={{ timeLeft }} id="eto.settings.seconds" />
        </>
      )}
      {timeLeft === 0 && (
        <>
          <FormattedMessage id="eto.settings.time-left-none" />
        </>
      )}
    </>
  );
};

const FancyRenderTimeLeft: React.ComponentType<ITimeLeftProps> = ({ timeLeft }) => {
  const [days, hours, minutes] = calculateTimeLeftUnits(timeLeft);

  if (days > 0) {
    return (
      <span className={styles.etoTimeLeft}>
        <span className={styles.largeGreen}>{days}</span>{" "}
        <FormattedMessage values={{ days }} id="eto.settings.days" />
        {hours > 0 ? (
          <>
            {", "}
            <span className={styles.largeGreen}>{hours}</span>{" "}
            <FormattedMessage values={{ hours }} id="eto.settings.hours" />
          </>
        ) : null}
      </span>
    );
  } else if (hours > 0) {
    return (
      <span className={styles.etoTimeLeft}>
        <span className={styles.largeGreen}>{hours}</span>{" "}
        <FormattedMessage values={{ hours }} id="eto.settings.hours" />
        {minutes > 0 ? (
          <>
            {" "}
            <span className={styles.largeGreen}>{minutes}</span>{" "}
            <FormattedMessage values={{ minutes }} id="eto.settings.minutes" />
          </>
        ) : null}
      </span>
    );
  } else if (minutes > 0) {
    return (
      <span className={styles.etoTimeLeft}>
        <span className={styles.largeGreen}>{minutes}</span>{" "}
        <FormattedMessage values={{ minutes }} id="eto.settings.minutes" />
      </span>
    );
  } else if (timeLeft > 0 && days === 0 && hours === 0 && minutes === 0) {
    return (
      <span className={styles.etoTimeLeft}>
        <span className={styles.largeGreen}>{timeLeft}</span>{" "}
        <FormattedMessage values={{ timeLeft }} id="eto.settings.seconds" />
      </span>
    );
  } else {
    return (
      <span className={styles.etoTimeLeft}>
        {process.env.STORYBOOK_RUN === "1" ? (
          <img src={test_sheep} alt="no time left" />
        ) : (
          <img src={sheep} alt="no time left" />
        )}
      </span>
    );
  }
};

class TimeLeftRefresher extends React.PureComponent<ITimeLeftRefresher, { timeLeft: number }> {
  timeout: number | undefined = undefined;
  constructor(props: ITimeLeftRefresher) {
    super(props);
    this.state = {
      timeLeft: calculateTimeLeft(this.props.finalTime, this.props.asUtc),
    };
    this.doRefresh();
  }

  doRefresh = () => {
    this.timeout = window.setTimeout(
      () => {
        window.clearTimeout(this.timeout);
        if (this.state.timeLeft > 0) {
          this.doRefresh();
        }
        this.setState({ timeLeft: calculateTimeLeft(this.props.finalTime, this.props.asUtc) });
      },
      this.state.timeLeft > 3600 ? 60000 : 1000,
    );
  };

  componentWillUnmount = (): void => {
    window.clearTimeout(this.timeout);
  };

  componentDidUpdate(prevProps: Readonly<ITimeLeftRefresher>): void {
    if (prevProps.finalTime !== this.props.finalTime) {
      this.setState({ timeLeft: calculateTimeLeft(this.props.finalTime, this.props.asUtc) });
    }
  }

  render(): React.ReactNode {
    return <this.props.renderComponent timeLeft={this.state.timeLeft} />;
  }
}

const FancyTimeLeft = ({ finalTime, asUtc }: any) =>
  process.env.STORYBOOK_RUN !== "1" ? (
    <TimeLeftRefresher finalTime={finalTime} asUtc={asUtc} renderComponent={FancyRenderTimeLeft} />
  ) : (
    <FancyRenderTimeLeft timeLeft={calculateTimeLeft(finalTime, true)} />
  );

const TimeLeft = ({ finalTime, asUtc, refresh }: any) =>
  refresh && process.env.STORYBOOK_RUN !== "1" ? (
    <TimeLeftRefresher finalTime={finalTime} asUtc={asUtc} renderComponent={RenderTimeLeft} />
  ) : (
    <RenderTimeLeft timeLeft={calculateTimeLeft(finalTime, true)} />
  );

export { FancyTimeLeft, TimeLeft, RenderTimeLeft, FancyRenderTimeLeft };
