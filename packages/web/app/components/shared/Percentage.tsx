import * as React from "react";

import { TDataTestId } from "../../types";

type IExternalProps = {
  children: number;
};

const Percentage: React.FunctionComponent<IExternalProps & TDataTestId> = ({
  children,
  "data-test-id": dataTestId,
}) => <span data-test-id={dataTestId}>{`${children * 100}%`}</span>;

export { Percentage };
