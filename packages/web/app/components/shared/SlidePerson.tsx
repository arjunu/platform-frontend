import * as cn from "classnames";
import * as React from "react";

import { TSocialChannelsType } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { ISrcSet } from "./Image";
import { ResponsiveImage } from "./ResponsiveImage";
import { SocialProfilesList } from "./SocialProfilesList";

import * as styles from "./SlidePerson.module.scss";

export type TSlidePersonLayout = "horizontal" | "vertical";

interface IProps {
  srcSet: ISrcSet;
  name: string;
  socialChannels: TSocialChannelsType;
  role: string;
  layout?: TSlidePersonLayout;
  description: string | React.ReactNode;
  elementWidth?: number;
}

const SlidePerson: React.FunctionComponent<IProps> = ({
  srcSet,
  name,
  role,
  layout = "vertical",
  socialChannels,
}) => (
  <div className={cn(styles.slidePerson, layout)}>
    <div className={styles.profile}>
      <div className={styles.image}>
        <ResponsiveImage srcSet={srcSet} alt={name} theme={"transparent"} />
      </div>
      <h5 className={styles.name}>{name}</h5>
      {role && <h6 className={styles.title}>{role}</h6>}
      {socialChannels && (
        <SocialProfilesList
          profiles={socialChannels}
          layoutIconSize="small"
          layoutIconsPosition="center"
        />
      )}
    </div>
  </div>
);

export { SlidePerson };
