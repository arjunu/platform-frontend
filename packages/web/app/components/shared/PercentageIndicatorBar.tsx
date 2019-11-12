import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../types";

import * as styles from "./PercentageIndicatorBar.module.scss";

type TLayout = "narrow";

type TTheme = "green";

interface ICommonProps {
  layout?: TLayout;
  theme?: TTheme;
}

type TProps = {
  percent?: number;
  progress?: TProgressBarProps[];
  renderProgressBar?: () => React.ReactNode;
  svgGroupStyle?: React.SVGProps<SVGGElement>;
  svgHeight?: number;
  children?: React.ReactNode;
};

type IProps = ICommonProps & TProps;

type TProgressBarBaseProps = {
  height: number;
  radius: number;
};

type TProgressBarExternalProps = {
  theme?: TTheme;
  progress?: number;
  height?: number;
  radius?: number;
};

type TProgressBarProps = TProgressBarExternalProps & CommonHtmlProps;

const DEFAULT_CURVE = 20;
const NARROW_CURVE = 5;

const BackgroundBar: React.FunctionComponent<
  TProgressBarBaseProps & TProgressBarBaseProps & CommonHtmlProps
> = ({ className, style, height, radius }) => (
  <rect
    width="100%"
    height={height}
    className={cn(styles.background, className)}
    rx={radius}
    ry={radius}
    style={style}
  />
);

const ProgressBar: React.FunctionComponent<TProgressBarBaseProps & TProgressBarProps> = ({
  theme,
  style,
  progress = 100,
  height,
  radius,
}) => (
  <rect
    className={cn(styles.progress, { [styles.progressGreen]: theme === "green" })}
    width={`${progress}%`}
    height={height}
    rx={radius}
    ry={radius}
    style={style}
  />
);

/**
 * Takes either percentage value or fraction. Makes sure that % is rounded to the nearest integer.
 */
const PercentageIndicatorBar = React.forwardRef<HTMLDivElement, IProps & CommonHtmlProps>(
  ({ percent, progress, theme, layout, children, svgGroupStyle, svgHeight, ...htmlProps }, ref) => {
    const isNarrow = layout === "narrow";
    const computedCurve = isNarrow ? NARROW_CURVE : DEFAULT_CURVE;
    const computedHeight = isNarrow ? 10 : 38;

    return (
      <div
        {...htmlProps}
        className={cn(styles.percentageIndicatorBar, htmlProps.className, theme)}
        ref={ref}
      >
        {!isNarrow && (
          <span className={styles.label} data-test-id="percentage-indicator-bar-value">
            {Math.round(percent!)}%
          </span>
        )}
        <svg width="100%" height={svgHeight || computedHeight}>
          <defs>
            <clipPath id="percent-indicator-bar">
              <rect width="100%" height={computedHeight} rx={computedCurve} ry={computedCurve} />
            </clipPath>
          </defs>
          <g {...svgGroupStyle}>
            <g clipPath="url(#percent-indicator-bar)">
              <BackgroundBar radius={computedCurve} height={computedHeight} />

              {progress ? (
                progress.map((progressProps, i) => (
                  <ProgressBar
                    key={i}
                    height={computedHeight}
                    radius={computedCurve}
                    {...progressProps}
                  />
                ))
              ) : (
                <ProgressBar
                  style={{ transform: `translateX(${percent! - 100}%)` }}
                  radius={computedCurve}
                  height={computedHeight}
                />
              )}
            </g>
            {children}
          </g>
        </svg>
      </div>
    );
  },
);

export { PercentageIndicatorBar, ProgressBar, TProgressBarProps };
