import * as React from "react";

import { CommonHtmlProps, TDataTestId, TTranslatedString } from "../../types";
import { EHeadingSize, Heading } from "./Heading";

interface IProps {
  title: string | React.ReactNode;
  description?: TTranslatedString;
  size?: EHeadingSize;
}

const DashboardHeading: React.FunctionComponent<IProps & TDataTestId & CommonHtmlProps> = ({
  title,
  "data-test-id": dataTestId,
  className,
  size,
  description,
}) => (
  <Heading
    level={3}
    className={className}
    decorator={false}
    size={size}
    data-test-id={dataTestId}
    description={description}
  >
    {title}
  </Heading>
);

export { DashboardHeading };
