import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { TTranslatedString } from "../../types";

enum EDelimiter {
  COMMA = ",",
  OR = "or",
  AND = "and",
}

type TExternalProps = {
  items: TTranslatedString[];
  delimiter?: EDelimiter | TTranslatedString;
  lastDelimiter?: EDelimiter | TTranslatedString;
};

const selectDelimiter = (delimiter: EDelimiter | TTranslatedString) => {
  switch (delimiter) {
    case EDelimiter.COMMA:
      return ", ";
    case EDelimiter.OR:
      return (
        <>
          {" "}
          <FormattedMessage id="formatted-list.delimiter.or" />{" "}
        </>
      );
    case EDelimiter.AND:
      return (
        <>
          {" "}
          <FormattedMessage id="formatted-list.delimiter.and" />{" "}
        </>
      );
    default:
      return delimiter;
  }
};

const FormattedList: React.FunctionComponent<TExternalProps> = React.memo(
  ({ items, delimiter = EDelimiter.COMMA, lastDelimiter }) => (
    <>
      {items.reduce<TTranslatedString[]>((p, c, i, arr) => {
        const val = <span key={`value-${i}`}>{c}</span>;

        if (i === 0) {
          return [val];
        }

        if (i === arr.length - 1) {
          return [
            ...p,
            <span key={`delimiter-${i}`}>{selectDelimiter(lastDelimiter || delimiter)}</span>,
            val,
          ];
        }

        return [...p, <span key={`delimiter-${i}`}>{selectDelimiter(delimiter)}</span>, val];
      }, [])}
    </>
  ),
);

export { FormattedList, EDelimiter };
