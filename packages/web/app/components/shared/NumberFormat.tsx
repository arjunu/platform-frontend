import * as React from "react";

import { TBigNumberVariants } from "../../lib/web3/types";
import { formatThousands } from "./formatters/utils";

interface IProps {
  value: TBigNumberVariants;
}

/*
 * @deprecated
 * use  /Users/lexey/projects/platform-frontend/app/components/shared/formatters/FormatNumber.tsx
 * */
const NumberFormat: React.FunctionComponent<IProps> = ({ value }) => (
  <>{formatThousands(`${value}`)}</>
);

export { NumberFormat };
