import * as React from "react";

import * as styles from "./ChartLegend.module.scss";

interface IDataset {
  data: number[];
  backgroundColor: string[];
}

interface IData {
  datasets: IDataset[];
  labels: string[];
}

interface IProps {
  data: IData;
}

export const ChartLegend: React.FunctionComponent<IProps> = ({ data }) => (
  <div>
    {data.datasets.map(dataset =>
      dataset.data.map((value, index) => (
        <div className={styles.chartLegend} key={data.labels[index]}>
          <div
            className={styles.indicator}
            style={{ backgroundColor: dataset.backgroundColor[index] }}
          />
          <div>{`${data.labels[index]} ${value}%`}</div>
        </div>
      )),
    )}
  </div>
);
