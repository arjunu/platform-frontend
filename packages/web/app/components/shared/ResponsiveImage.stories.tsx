import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ResponsiveImage } from "./ResponsiveImage";

import * as image from "../../assets/img/wallet_selector/logo_metamask@2x.png";

storiesOf("ResponsiveImage", module).add("default", () => (
  <ResponsiveImage
    width={1}
    height={1}
    srcSet={{
      "1x": image,
      "2x": image,
      "3x": image,
    }}
    alt="responsive image"
  />
));
