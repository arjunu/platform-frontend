import * as React from "react";

import { externalRoutes } from "../../../config/externalRoutes";
import { withParams } from "../../../utils/withParams";
import { LoadingIndicatorHexagon } from "../../shared/loading-indicator/LoadingIndicatorHexagon";

import * as styles from "./EtoViewFundraisingStatistics.module.scss";

const EtoViewFundraisingStatistics: React.FunctionComponent<{ etoId: string }> = ({ etoId }) => {
  let statsUrl = withParams(externalRoutes.icoMonitorStats, { etoId });

  if (process.env.NF_USE_FAKE_ETO_STATS === "1") {
    // hardcode url if is .io or .net or localhost, ignore for cypress run
    statsUrl = "https://test.icomonitor.io/#/stats/0x01A1f17808edAE0B004A4F11a03620D3d804b997";
  }

  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [height, setHeight] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const onMessage = (msg: MessageEvent) => {
      const { origin } = new URL(statsUrl);
      if (msg.origin === origin) {
        const receivedHeight = Number(msg.data);

        if (isLoading && receivedHeight > 0) {
          // Mark component as loaded on first message
          // with height >0 received from iFrame
          setIsLoading(false);
        }

        if (!Number.isNaN(receivedHeight)) {
          setHeight(receivedHeight);
        }
      }
    };

    if (iframeRef.current) {
      window.addEventListener("message", onMessage);
    }

    return () => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <>
      {isLoading && <LoadingIndicatorHexagon />}
      <iframe
        sandbox="allow-scripts allow-same-origin"
        ref={iframeRef}
        style={{ height: height }}
        src={statsUrl}
        className={styles.fundraisingContainer}
        scrolling="no"
        data-test-id="eto.public-view.fundraising-statistics.iframe"
      />
    </>
  );
};

export { EtoViewFundraisingStatistics };
