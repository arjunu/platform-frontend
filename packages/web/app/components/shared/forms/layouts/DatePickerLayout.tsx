import * as moment from "moment";
import * as React from "react";
import * as DateTime from "react-datetime";
import { FormattedMessage } from "react-intl-phraseapp";

import { TDataTestId } from "../../../../types";
import { InlineIcon } from "../../icons/index";
import { TimeLeft } from "../../TimeLeft.unsafe";
import { utcTime } from "../../utils";

import "react-datetime/css/react-datetime.css";
import iconCalendar from "../../../../assets/img/inline_icons/calendar.svg";
import * as styles from "./DatePickerLayout.module.scss";

// We need to do this because of missing type for `renderInput`
// https://github.com/YouCanBookMe/react-datetime/pull/541
type DatetimeProps = React.ComponentProps<typeof DateTime> & {
  dataTestId?: string;
  renderInput?: (
    // tslint:disable-next-line:no-any-on-steroid
    props: any,
    openCalendar: () => void,
    closeCalendar: () => void,
    onChange: () => void,
  ) => void;
};

const TypedDatetime = DateTime as React.ComponentType<DatetimeProps>;

interface IDatePickerProps {
  isValidDate?: (currentDate: moment.Moment) => boolean;
}

interface ITestInputProps {
  onTestInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TestInput: React.ComponentType<ITestInputProps & TDataTestId> = ({
  "data-test-id": dataTestId,
  onTestInputChange,
}) => (
  //hidden input for e2e tests
  <>
    {process.env.NF_CYPRESS_RUN === "1" || process.env.NODE_ENV === "development" ? (
      <input
        data-test-id={dataTestId}
        autoComplete="off"
        type="text"
        style={{ display: "none" }}
        onChange={
          onTestInputChange && ((e: React.ChangeEvent<HTMLInputElement>) => onTestInputChange(e))
        }
      />
    ) : null}
  </>
);

class DatePickerLayout extends React.PureComponent<
  DatetimeProps & IDatePickerProps & ITestInputProps
> {
  shouldComponentUpdate(nextProps: DatetimeProps & IDatePickerProps & ITestInputProps): boolean {
    return (
      Boolean(this.props.value) &&
      Boolean(nextProps.value) &&
      moment.utc(this.props.value).diff(nextProps.value, undefined, true) !== 0
    );
  }

  render(): React.ReactNode {
    const { dataTestId, value, onChange, isValidDate, onTestInputChange } = this.props;
    return (
      <TypedDatetime
        utc={true}
        dateFormat={"L"}
        timeFormat={"HH:mm z"}
        value={value}
        onChange={onChange}
        isValidDate={isValidDate}
        renderInput={(props, openCalendar) => (
          <>
            <TestInput data-test-id={dataTestId} onTestInputChange={onTestInputChange} />
            <div className={styles.formFieldDatePicker} onClick={openCalendar}>
              <div className={styles.icon}>
                <InlineIcon svgIcon={iconCalendar} />
              </div>
              <div className={styles.chosenDate}>
                <span>{utcTime(props.value)}</span>
                <span>
                  <FormattedMessage id="eto.settings.set-eto-start-date-time-left" />{" "}
                  <TimeLeft key={props.value} refresh={true} finalTime={props.value} asUtc={true} />
                </span>
              </div>
            </div>
          </>
        )}
      />
    );
  }
}

export { DatePickerLayout };
