import * as cn from "classnames";
import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import { compose } from "redux";

import {
  IIntlHelpers,
  IIntlProps,
  injectIntlHelpers,
} from "../../../utils/injectIntlHelpers.unsafe";
import { DEFAULT_CHART_COLOR } from "../../eto/shared/EtoView";
import { OTHERS_NAME } from "../../eto/utils";
import { ChartLegend } from "./ChartLegend";

import * as styles from "./ChartDoughnut.module.scss";

type TLayout = "vertical";

interface IBody {
  before: string[];
  lines: string[];
  after: string[];
}

interface ITooltipModel {
  title: string[];
  body: IBody[];
  caretX: number;
  caretY: number;
  opacity: number;
}

interface IChart {
  _chart: any; //dummy typing to silence the linter
}

interface IProps {
  data: any;
  className?: string;
  layout?: TLayout;
  defaultLabel?: string;
}

interface IDataset {
  data: number[];
  backgroundColor: string[];
}

interface IData {
  datasets: IDataset[];
  labels: string[];
}

interface ITooltipItem {
  index: number;
}

function createCustomTooltip(style: string): (this: IChart, tooltipModel: ITooltipModel) => void {
  return function(this: IChart, tooltipModel: ITooltipModel): void {
    const createTooltipElement = (): HTMLElement => {
      const tooltipEl = document.createElement("div");
      tooltipEl.id = "chartjs-tooltip";
      tooltipEl.style.position = "absolute"; //just to still have a tooltip even if style is misspelled
      tooltipEl.classList.add(style);

      return tooltipEl;
    };

    const appendTexts = (rootNode: HTMLElement, textArray: string[], className?: string) => {
      const textLines = textArray || [];
      textLines.forEach((line: string) => {
        const node = document.createElement("span");
        const text = document.createTextNode(line);
        node.appendChild(text);
        if (className) {
          node.classList.add(className);
        }
        rootNode.appendChild(node);
      });
      return rootNode;
    };

    const getBodyLines = (body: IBody[]) =>
      body
        ? body.reduce(
            (acc, bodyEl) => (bodyEl.lines.length ? acc.concat(bodyEl.lines) : acc),
            [] as string[],
          )
        : [];

    const clearTooltip = (rootElement: HTMLElement) => {
      [...rootElement.childNodes].forEach(el => {
        rootElement.removeChild(el);
      });
    };

    const updateTooltip = (tooltipEl: HTMLElement, canvas: HTMLElement, model: ITooltipModel) => {
      const position = canvas.getBoundingClientRect();
      clearTooltip(tooltipEl);

      appendTexts(tooltipEl, model.title);
      appendTexts(tooltipEl, getBodyLines(model.body));

      tooltipEl.style.left = `${position.left + window.pageXOffset + model.caretX}px`;
      tooltipEl.style.top = `${position.top + window.pageYOffset + model.caretY}px`;
      tooltipEl.style.opacity = model.opacity.toString();
    };

    const tooltipEl =
      document.getElementById("chartjs-tooltip") ||
      document.body.appendChild(createTooltipElement());
    updateTooltip(tooltipEl, this._chart.canvas, tooltipModel);
  };
}

const hasData = (data: IData) => data.datasets[0].data.length > 0;

const labelCallback = ({ formatIntlMessage }: IIntlHelpers) => (
  tooltipItem: ITooltipItem,
  data: IData,
) => {
  const label = data.labels[tooltipItem.index];
  if (label === OTHERS_NAME) {
    return formatIntlMessage("shared.chart-doughnut.others");
  }
  return label;
};

const ChartDoughnutLayout: React.FunctionComponent<IProps & IIntlProps> = ({
  intl,
  data,
  layout,
  className,
  defaultLabel,
}) => {
  let chartData = hasData(data)
    ? data
    : {
        datasets: [
          {
            data: [1],
            backgroundColor: DEFAULT_CHART_COLOR,
            borderWidth: 0,
          },
        ],
        labels: [defaultLabel ? defaultLabel : "no data"],
      };
  const chartOptions = {
    tooltips: {
      enabled: false,
      custom: createCustomTooltip(styles.tooltip),
      callbacks: {
        label: labelCallback(intl),
      },
    },
  };
  return (
    <div className={cn(styles.chartDoughnut, className, layout || "")}>
      <div className={styles.chartWrapper}>
        <Doughnut
          data={chartData}
          legend={{ display: false }}
          height={100}
          width={100}
          options={chartOptions}
        />
      </div>
      <div className={styles.legendWrapper}>
        <ChartLegend data={data} />
      </div>
    </div>
  );
};

export const ChartDoughnut = compose(injectIntlHelpers)(ChartDoughnutLayout);
