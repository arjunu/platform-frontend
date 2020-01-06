import * as React from "react";
import { FormattedHTMLMessage } from "react-intl-phraseapp";

import { ResponsiveImage } from "../../../shared/ResponsiveImage";
import { EtoCardPanel } from "./EtoCardPanel";

import comingSoonImg from "../../../../assets/img/etos-comings-soon/coming-soon.png";
import * as styles from "./EtosComingSoonThumbnail.module.scss";

export const EtosComingSoonThumbnail: React.FunctionComponent = () => (
  <EtoCardPanel data-test-id="eto-overview-coming-soon">
    <ResponsiveImage
      theme={"light"}
      width={400}
      height={400}
      srcSet={{
        "1x": comingSoonImg,
      }}
      alt=""
    />
    <p className={styles.text}>
      <FormattedHTMLMessage tagName="span" id="dashboard.eto.thumbnail.coming-soon-placeholder" />
    </p>
  </EtoCardPanel>
);
