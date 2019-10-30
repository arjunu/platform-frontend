import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { TTranslatedString } from "../../../types";
import { normalize } from "../../../utils/NumberUtils";
import { PercentageIndicatorBar, TProgressBarProps } from "../../shared/PercentageIndicatorBar";
import { getCurrentInvestmentProgressPercentage, getInvestmentCalculatedPercentage } from "./utils";

import * as styles from "./InvestmentProgress.module.scss";

type TProps = {
  eto: TEtoWithCompanyAndContractReadonly;
};

type TLabelExternalProps = {
  label: TTranslatedString;
  width: string | number;
  textAnchor?: "start" | "end" | "middle";
};

const getTextAnchor = (widthPercentage: number): "start" | "end" | "middle" => {
  switch (widthPercentage) {
    case 1:
      return "end";
    case 0:
      return "start";
    default:
      return "middle";
  }
};

const Label = React.forwardRef<SVGTextElement, TLabelExternalProps>(
  ({ label, width, textAnchor = "middle" }, ref) => (
    <text x={width} y={30} textAnchor={textAnchor} className={styles.label} ref={ref}>
      {label}
    </text>
  ),
);

const InvestmentProgress: React.FunctionComponent<TProps> = ({ eto }) => {
  const calculatedPercentage = getInvestmentCalculatedPercentage(eto);
  const currentProgressPercentage = getCurrentInvestmentProgressPercentage(eto);

  const getNormalizedValue = normalize({ min: 0, max: calculatedPercentage });

  const successOfEtoNormalized = getNormalizedValue(100);
  const currentProgressOfEtoNormalized = getNormalizedValue(currentProgressPercentage);

  const progress: TProgressBarProps[] = [
    { progress: Math.ceil(currentProgressOfEtoNormalized * 100), theme: "green" },
  ];

  const containerRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<SVGTextElement>(null);
  const [labelWidthFraction, setLabelWidthFraction] = React.useState(successOfEtoNormalized);

  React.useLayoutEffect(() => {
    if (labelRef.current && containerRef.current) {
      const { width: textWidth } = labelRef.current.getBoundingClientRect();
      const { width: containerWidth } = containerRef.current.getBoundingClientRect();

      const currentWidth = containerWidth * successOfEtoNormalized;
      const boxHalfWidth = textWidth / 2;

      // if we overflow the container from the end
      if (currentWidth + boxHalfWidth > containerWidth) {
        setLabelWidthFraction(1);
      }
      // if we overflow the container from the start
      else if (currentWidth - boxHalfWidth < 0) {
        setLabelWidthFraction(0);
      } else {
        setLabelWidthFraction(successOfEtoNormalized);
      }
    }
  }, [successOfEtoNormalized, labelRef.current]);

  return (
    <PercentageIndicatorBar
      className={styles.investmentProgress}
      layout="narrow"
      progress={progress}
      svgGroupStyle={{ transform: `translate(0 4)` }}
      svgHeight={40}
      ref={containerRef}
    >
      <rect x={`${successOfEtoNormalized * 100}%`} y={-6} className={cn(styles.successPoint)} />

      <Label
        ref={labelRef}
        label={
          currentProgressPercentage >= 100 ? (
            <FormattedMessage id="shared-component.eto-overview.invest.min-amount-reached" />
          ) : (
            <FormattedMessage id="shared-component.eto-overview.invest.min-amount" />
          )
        }
        width={`${labelWidthFraction * 100}%`}
        textAnchor={getTextAnchor(labelWidthFraction)}
      />
    </PercentageIndicatorBar>
  );
};

export { InvestmentProgress };
