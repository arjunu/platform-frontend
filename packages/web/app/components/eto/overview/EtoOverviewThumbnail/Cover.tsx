import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EJurisdiction } from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { assertNever } from "../../../../utils/assertNever";
import { ISrcSet } from "../../../shared/Image";
import { EImageFit, ResponsiveImage } from "../../../shared/ResponsiveImage";
import { Tag } from "../../../shared/Tag";

import * as styles from "./Cover.module.scss";

type TImage = {
  srcSet: ISrcSet;
  alt: string;
};

interface IProps {
  companyBanner: TImage;
  jurisdiction: EJurisdiction | undefined;
  tags: ReadonlyArray<TTranslatedString> | undefined;
}

const Jurisdiction: React.FunctionComponent<{ jurisdiction: EJurisdiction }> = ({
  jurisdiction,
}) => {
  switch (jurisdiction.toUpperCase()) {
    //This is done For Storybook
    case EJurisdiction.GERMANY:
      return (
        <FormattedMessage
          id="eto-overview-thumbnail.cover.jurisdiction.de"
          values={{
            lineBreak: <br />,
          }}
        />
      );
    case EJurisdiction.LIECHTENSTEIN:
      return (
        <FormattedMessage
          id="eto-overview-thumbnail.cover.jurisdiction.li"
          values={{
            lineBreak: <br />,
          }}
        />
      );
    default:
      return assertNever(jurisdiction as never, `${jurisdiction} is not a valid jurisdiction`);
  }
};

const Cover: React.FunctionComponent<IProps & CommonHtmlProps> = ({
  className,
  jurisdiction,
  companyBanner,
  tags = [],
}) => (
  <div className={cn(styles.cover, className)}>
    <ResponsiveImage
      width={394}
      height={205}
      srcSet={companyBanner.srcSet}
      alt={companyBanner.alt}
      fit={EImageFit.COVER}
    />

    {jurisdiction && (
      <div className={cn(styles.jurisdiction, "mb-0")}>
        <Jurisdiction jurisdiction={jurisdiction} />
      </div>
    )}

    <div className={styles.tags}>
      {/* Only two first tags should be shown */}
      {tags.slice(0, 2).map((tag, index) => (
        <Tag text={tag} className={styles.tag} layout="bold" theme="dark" key={index} />
      ))}
    </div>
  </div>
);

export { Cover };
