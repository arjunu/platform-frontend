import * as cn from "classnames";
import * as React from "react";

import { COMPANY_TAGS_LIMIT } from "../../../config/constants";
import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { TTranslatedString } from "../../../types";
import { Container, EColumnSpan, EContainerType } from "../../layouts/Container";
import { srcSetToString } from "../../shared/HiResImage";
import { IResponsiveImage } from "../../shared/ResponsiveImage";
import { Tag } from "../../shared/Tag";

import * as styles from "./Cover.module.scss";

interface IProps {
  companyBanner: IResponsiveImage;
  companyName: TTranslatedString;
  companyOneliner: TTranslatedString;
  companyLogo: IResponsiveImage;
  companyJurisdiction: EJurisdiction;
  tags: ReadonlyArray<TTranslatedString> | undefined;
}

export const Cover: React.FunctionComponent<IProps> = ({
  companyBanner,
  companyName,
  companyLogo,
  tags = [],
}) => (
  <Container
    columnSpan={EColumnSpan.THREE_COL}
    className={styles.cover}
    type={EContainerType.CONTAINER}
  >
    <img
      src={companyBanner.srcSet["1x"]}
      srcSet={srcSetToString(companyBanner.srcSet)}
      alt={companyBanner.alt}
    />
    <div className={styles.companyDetails}>
      <div className={styles.logoWrapper}>
        <img src={companyLogo.srcSet["1x"]} alt={companyLogo.alt} />
      </div>
      <div className={styles.details}>
        <h1 className={styles.name}>{companyName}</h1>
      </div>
      <div className={styles.tags}>
        {tags.slice(0, COMPANY_TAGS_LIMIT).map((tag, index) => (
          <Tag
            text={tag}
            className={cn(styles.tag, "ml-3")}
            layout="bold"
            theme="dark"
            key={index}
          />
        ))}
      </div>
    </div>
  </Container>
);
