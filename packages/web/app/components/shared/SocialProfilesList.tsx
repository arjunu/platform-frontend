import * as cn from "classnames";
import { isEmpty } from "lodash";
import * as React from "react";

import {
  ESocialChannelType,
  TSocialChannelsType,
  TSocialChannelType,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { RequiredNonNullable } from "../../types";
import { InlineIcon } from "./icons";
import { ExternalLink } from "./links";

import * as bitcointalk from "../../assets/img/inline_icons/icon-menu-help.svg";
import * as facebook from "../../assets/img/inline_icons/social_facebook.svg";
import * as github from "../../assets/img/inline_icons/social_github.svg";
import * as gplus from "../../assets/img/inline_icons/social_google_plus.svg";
import * as instagram from "../../assets/img/inline_icons/social_instagram.svg";
import * as linkedin from "../../assets/img/inline_icons/social_linkedin.svg";
import * as medium from "../../assets/img/inline_icons/social_medium.svg";
import * as reddit from "../../assets/img/inline_icons/social_reddit.svg";
import * as slack from "../../assets/img/inline_icons/social_slack.svg";
import * as telegram from "../../assets/img/inline_icons/social_telegram.svg";
import * as twitter from "../../assets/img/inline_icons/social_twitter.svg";
import * as xing from "../../assets/img/inline_icons/social_xing.svg";
import * as youtube from "../../assets/img/inline_icons/social_youtube.svg";
import * as styles from "./SocialProfilesList.module.scss";

type TLayoutSize = "small";
type TLayoutPosition = "center";

interface IProps {
  profiles: TSocialChannelsType;
  layoutIconSize?: TLayoutSize;
  layoutIconsPosition?: TLayoutPosition;
  showLabels?: boolean;
  isClickable?: boolean;
}

export const SOCIAL_PROFILE_ICONS: { [key in ESocialChannelType]: string } = {
  [ESocialChannelType.FACEBOOK]: facebook,
  [ESocialChannelType.GITHUB]: github,
  [ESocialChannelType.G_PLUS]: gplus,
  [ESocialChannelType.INSTAGRAM]: instagram,
  [ESocialChannelType.LINKEDIN]: linkedin,
  [ESocialChannelType.MEDIUM]: medium,
  [ESocialChannelType.REDDIT]: reddit,
  [ESocialChannelType.SLACK]: slack,
  [ESocialChannelType.TELEGRAM]: telegram,
  [ESocialChannelType.TWITTER]: twitter,
  [ESocialChannelType.XING]: xing,
  [ESocialChannelType.YOUTUBE]: youtube,
  [ESocialChannelType.BITCOINTALK]: bitcointalk,
};

const isSocialProfileAvailable = (
  socialProfile: TSocialChannelType,
): socialProfile is RequiredNonNullable<TSocialChannelType> =>
  !isEmpty(socialProfile.url) && !isEmpty(socialProfile.type);

const SocialProfilesList: React.FunctionComponent<IProps> = ({
  profiles,
  layoutIconSize,
  layoutIconsPosition,
}) => (
  <div className={cn(styles.socialProfilesList, layoutIconSize, layoutIconsPosition)}>
    {profiles.map(
      profile =>
        isSocialProfileAvailable(profile) && (
          <div className={styles.profile} key={`${profile.type}-${profile.url}`}>
            <ExternalLink href={profile.url} title={profile.type} className={styles.icon}>
              <InlineIcon svgIcon={SOCIAL_PROFILE_ICONS[profile.type]} alt={profile.type} />
            </ExternalLink>
          </div>
        ),
    )}
  </div>
);

export { SocialProfilesList };
