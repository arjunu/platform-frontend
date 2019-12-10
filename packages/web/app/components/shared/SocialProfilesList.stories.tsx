import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ESocialChannelType } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { SocialProfilesList } from "./SocialProfilesList";

const socialProfiles = [
  {
    type: ESocialChannelType.SLACK,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.TWITTER,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.MEDIUM,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.REDDIT,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.TELEGRAM,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.GITHUB,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.INSTAGRAM,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.G_PLUS,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.YOUTUBE,
    url: "www.neufund.org",
  },
  {
    type: ESocialChannelType.XING,
    url: "www.neufund.org ",
  },
];

storiesOf("SocialProfiles/SocialProfilesList", module).add("default", () => (
  <SocialProfilesList profiles={socialProfiles} />
));
