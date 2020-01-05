import { storiesOf } from "@storybook/react";
import * as React from "react";

import mp4 from "../../assets/img/eto_offers/uniti.mp4";
import webm from "../../assets/img/eto_offers/uniti.webm";
import { ResponsiveVideo } from "./ResponsiveVideo";

storiesOf("ResponsiveVideo", module).add("default", () => (
  <ResponsiveVideo
    sources={{
      webm: webm,
      mp4: mp4,
    }}
    width={1}
    height={1}
  />
));
