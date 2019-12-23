import { storiesOf } from "@storybook/react";
import * as React from "react";

import { formWrapper } from "./forms/fields/testingUtils.unsafe";
import { SocialProfilesEditor } from "./SocialProfilesEditor";

import githubIcon from "../../assets/img/inline_icons/social_github.svg";
import googlePlusIcon from "../../assets/img/inline_icons/social_google_plus.svg";
import instagramIcon from "../../assets/img/inline_icons/social_instagram.svg";
import mediumIcon from "../../assets/img/inline_icons/social_medium.svg";
import redditIcon from "../../assets/img/inline_icons/social_reddit.svg";
import slackIcon from "../../assets/img/inline_icons/social_slack.svg";
import telegramIcon from "../../assets/img/inline_icons/social_telegram.svg";
import twitterIcon from "../../assets/img/inline_icons/social_twitter.svg";
import xingIcon from "../../assets/img/inline_icons/social_xing.svg";
import youtubeIcon from "../../assets/img/inline_icons/social_youtube.svg";

const socialProfiles = [
  {
    name: "slack",
    placeholder: "slack",
    svgIcon: slackIcon,
  },
  {
    name: "twitter",
    placeholder: "twitter",
    svgIcon: twitterIcon,
  },
  {
    name: "gplus",
    placeholder: "google plus",
    svgIcon: googlePlusIcon,
  },
  {
    name: "Slack",
    svgIcon: slackIcon,
  },
  {
    name: "Medium",
    svgIcon: mediumIcon,
  },
  {
    name: "Reddit",
    url: "reddit.com",
    svgIcon: redditIcon,
    preSelected: true,
  },
  {
    name: "Telegram",
    svgIcon: telegramIcon,
  },
  {
    name: "Github",
    svgIcon: githubIcon,
    preSelected: true,
  },
  {
    name: "Instagram",
    svgIcon: instagramIcon,
  },
  {
    name: "Google+",
    svgIcon: googlePlusIcon,
  },
  {
    name: "YouTube",
    svgIcon: youtubeIcon,
  },
  {
    name: "Xing",
    svgIcon: xingIcon,
  },
];

storiesOf("SocialProfiles/SocialProfilesEditor", module).add(
  "default",
  formWrapper({ name: [{ type: "twitter", url: "fufu" }] })(() => (
    <SocialProfilesEditor profiles={socialProfiles} name="name" />
  )),
);
