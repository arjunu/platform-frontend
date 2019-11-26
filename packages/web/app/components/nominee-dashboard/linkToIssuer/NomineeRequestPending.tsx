import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { ENomineeRequestStatus } from "../../../modules/nominee-flow/types";
import { nomineeRequestToTranslationMessage } from "../../../modules/nominee-flow/utils";
import { Panel } from "../../shared/Panel";
import { getMessageTranslation } from "../../translatedMessages/messages";
import { StepStatus } from "../DashboardStepStatus";

import * as styles from "../NomineeDashboard.module.scss";

export const NomineeRequestPending: React.FunctionComponent = () => (
  <Panel className={styles.dashboardContentPanel} data-test-id="nominee-request-pending">
    <StepStatus
      contentTitleComponent={
        <FormattedMessage id="nominee-flow.link-with-issuer.link-with-issuer" />
      }
      contentTextComponent={[
        <FormattedMessage id="nominee-flow.link-with-issuer.pending.text1" />,
        <FormattedHTMLMessage
          tagName="span"
          id="nominee-flow.link-with-issuer.pending.text2"
          values={{ href: externalRoutes.neufundSupportHome }}
        />,
      ]}
      status={getMessageTranslation(
        nomineeRequestToTranslationMessage(ENomineeRequestStatus.PENDING),
      )}
    />
  </Panel>
);
