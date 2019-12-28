import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../../types";

import * as styles from "./FormLabel.module.scss";

type TFormLabelExternalProps = {
  for: string;
  inheritFont?: boolean;
  component?: React.ElementType;
};

const generateLabelId = (name: string) => `${name}-label`;

const FormLabel: React.FunctionComponent<TFormLabelExternalProps & CommonHtmlProps> = ({
  for: htmlFor,
  component = "label",
  children,
  className,
  inheritFont,
}) =>
  React.createElement(
    component,
    {
      // omit htmlFor attribute in case we don't want to use `label` html tag
      htmlFor: component === "label" ? htmlFor : undefined,
      id: generateLabelId(htmlFor),
      className: cn(styles.formLabel, className, { [styles.inheritFont]: inheritFont }),
    },
    children,
  );

export { generateLabelId, FormLabel };
