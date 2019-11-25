import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";

import * as styles from "./FormLabel.module.scss";

export type FormLabelExternalProps = {
  for: string;
  inheritFont?: boolean;
};

const generateLabelId = (name: string) => `${name}-label`;

const FormLabel: React.FunctionComponent<FormLabelExternalProps & CommonHtmlProps> = ({
  for: htmlFor,
  children,
  className,
  inheritFont,
}) => (
  <label
    htmlFor={htmlFor}
    id={generateLabelId(htmlFor)}
    className={cn(styles.formLabel, className, { [styles.inheritFont]: inheritFont })}
  >
    {children}
  </label>
);

export { generateLabelId, FormLabel };
