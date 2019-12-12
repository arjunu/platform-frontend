import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ESocialChannelType } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { SlidePerson } from "./SlidePerson";

const person = {
  srcSet: {
    "1x": "",
    "2x": "",
    "3x": "",
  },
  name: "person name",
  role: "person role",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non tenetur, impedit labore vero eum omnis iusto quaerat ea, facere perferendis quae!",
  socialChannels: [{ type: ESocialChannelType.FACEBOOK, url: "facebook.com/pawel" }],
};

storiesOf("SlidePerson", module)
  .add("layout: vertical", () => <SlidePerson {...person} layout="vertical" />)
  .add("layout: horizontal", () => <SlidePerson {...person} layout="horizontal" />);
