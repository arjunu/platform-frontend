import * as cn from "classnames";
import * as React from "react";

import { TTranslatedString } from "../../types";
import { Field } from "./Field";
import { InlineIcon } from "./icons";

import indicatorIcon from "../../assets/img/inline_icons/accordion_arrow.svg";
import * as styles from "./Accordion.module.scss";

interface IAccordionElementProps {
  title: TTranslatedString;
  isDefaultOpened?: boolean;
}

type IAccordionChildren =
  | React.ReactElement<IAccordionElementProps>
  | React.ReactElement<IAccordionElementProps>[]
  | null;

type TAccordionField = {
  value: string;
  name: string;
};

interface IAccordionProps {
  openFirst?: boolean;
  children?: IAccordionChildren | IAccordionChildren[];
}

const negate = (value: boolean) => !value;

const AccordionElement: React.FunctionComponent<IAccordionElementProps> = ({
  title,
  children,
  isDefaultOpened = false,
}) => {
  const [isOpened, setIsOpened] = React.useState(isDefaultOpened);

  const toggle = () => setIsOpened(negate);

  return (
    <div className={cn(styles.accordionElement, { [styles.isClosed]: !isOpened })}>
      <h4 className={styles.title} onClick={toggle}>
        <span>{title}</span>
        <InlineIcon width="16px" height="16px" svgIcon={indicatorIcon} />
      </h4>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

const Accordion: React.FunctionComponent<IAccordionProps> = ({ children, openFirst }) => (
  <div className={styles.accordion}>
    {React.Children.toArray(children)
      // filter all empty children
      .filter((child: React.ReactNode) => child)
      .map((child: React.ReactNode, index: number) =>
        openFirst && index === 0
          ? // clone element and add isOpened to it if it's first one
            React.cloneElement<IAccordionElementProps>(
              // type cast is required due of toArray that changes elements to ReactChild
              child as React.ReactElement<IAccordionElementProps>,
              { isDefaultOpened: true },
            )
          : child,
      )}
  </div>
);

const AccordionField: React.FunctionComponent<IAccordionElementProps & TAccordionField> = ({
  value,
  name,
  ...props
}) => {
  if (value) {
    return (
      <AccordionElement {...props}>
        <Field name={name} value={value} />
      </AccordionElement>
    );
  }

  return null;
};

export { Accordion, AccordionElement, AccordionField };
