import * as cn from "classnames";
import * as React from "react";

import { TDataTestId, TTranslatedString } from "../../../types";
import { EHeadingSize, Heading } from "../../shared/Heading";

type TProps = {
  title?: TTranslatedString;
  titleClassName?: string;
  hint?: TTranslatedString;
  text?: TTranslatedString;
  image?: React.ReactNode;
};

const Message: React.FunctionComponent<TProps & TDataTestId> = ({
  "data-test-id": dataTestId,
  titleClassName,
  image,
  title,
  text,
  hint,
  children,
}) => (
  <section className={cn("text-center", "mx-sm-5")} data-test-id={dataTestId}>
    {image}
    {title && (
      <Heading
        className="mb-3"
        titleClassName={titleClassName}
        level={3}
        decorator={false}
        size={EHeadingSize.SMALL}
      >
        {title}
      </Heading>
    )}
    {hint && <p className={cn("text-warning", "mx-sm-4")}>{hint}</p>}
    {text && <p className={cn("mx-sm-4", "mt-3")}>{text}</p>}
    {children}
  </section>
);
export { Message };
