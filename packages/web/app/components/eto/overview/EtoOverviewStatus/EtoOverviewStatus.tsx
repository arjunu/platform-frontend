import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";

import { EJurisdiction } from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { TEtoWithCompanyAndContractReadonly } from "../../../../modules/eto/types";
import { isEtoSoftCapReached, isFundraisingActive } from "../../../../modules/eto/utils";
import { CommonHtmlProps, XOR } from "../../../../types";
import { etoPublicViewLink } from "../../../appRouteUtils";
import { Container, EColumnSpan } from "../../../layouts/Container";
import { ETOInvestorState, ETOIssuerState } from "../../shared/ETOState";
import { EtoStats } from "./EtoStats";
import { EtoStatusManager } from "./EtoStatusManager/EtoStatusManager";
import { EtoTitle } from "./EtoTitle";
import { GreyInfo } from "./Info";
import { TagsWidget } from "./TagsWidget";

import * as styles from "./EtoOverviewStatus.module.scss";

type TExternalProps = XOR<
  {
    isEmbedded: true;
  },
  { isEmbedded: false; url: string }
> & { eto: TEtoWithCompanyAndContractReadonly; publicView: boolean };

interface IStatusOfEtoProps {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
}

interface IInfoProps {
  eto: TEtoWithCompanyAndContract;
  url: string;
}

interface IAdditionalInfoProps {
  isEmbedded: boolean;
  publicView: boolean;
  previewCode: string;
  jurisdiction: EJurisdiction;
}

const StatusOfEto: React.FunctionComponent<IStatusOfEtoProps> = ({ eto, publicView }) => (
  <div className={styles.statusOfEto}>
    {/* In case it's a public view (something investor sees) show proper investor status, otherwise show issuer related state */}
    {publicView ? <ETOInvestorState eto={eto} /> : <ETOIssuerState eto={eto} />}
  </div>
);

const PoweredByNeufund: React.FunctionComponent = () => (
  <div className={styles.poweredByNeufund} data-test-id="eto-overview-powered-by">
    <div className={styles.powered}>Powered by</div>
    <Link className={styles.neufund} target={"_blank"} to={"https://neufund.org"}>
      NEUFUND
    </Link>
  </div>
);

const AdditionalInfo: React.FunctionComponent<IAdditionalInfoProps> = ({
  isEmbedded,
  publicView,
  previewCode,
  jurisdiction,
}) => {
  if (isEmbedded) {
    return <PoweredByNeufund />;
  } else if (!publicView) {
    return (
      <Link className={styles.moreDetails} to={etoPublicViewLink(previewCode, jurisdiction)}>
        <FormattedMessage id="shared-component.eto-overview.more-details" />
      </Link>
    );
  } else {
    return null;
  }
};

const Divider: React.FunctionComponent<CommonHtmlProps> = ({
  className,
}: {
  className?: string;
}) => <div className={cn(styles.divider, className)} />;

const EtoInfo: React.FunctionComponent<IInfoProps> = ({ eto, url }) => {
  const isSoftCapReached = isEtoSoftCapReached(eto);
  const isActive = isFundraisingActive(eto);

  if (isSoftCapReached && isActive) {
    return (
      <GreyInfo>
        <FormattedMessage id="shared-component.eto-overview.info.soft-cap-reached" />{" "}
        <Link
          to={{
            pathname: `${url}/stats`,
            hash: "#eto-view-tabs",
          }}
        >
          <FormattedMessage id="shared-component.eto-overview.info.soft-cap-reached.view-details" />
        </Link>
      </GreyInfo>
    );
  }

  return null;
};

export const EtoOverviewStatus: React.FunctionComponent<TExternalProps> = ({
  eto,
  publicView,
  isEmbedded,
  url,
}) => (
  <Container
    className={styles.etoOverviewStatus}
    data-test-id={`eto-overview-${eto.etoId}`}
    columnSpan={EColumnSpan.THREE_COL}
  >
    <div className={styles.overviewWrapper}>
      <StatusOfEto eto={eto} publicView={publicView} />
      <EtoTitle eto={eto} isEmbedded={isEmbedded} />
      <Divider className={styles.dividerExtra} />
      <TagsWidget eto={eto} innerClass={styles.tagItem} isEmbedded={isEmbedded} />
      <Divider />
      <EtoStats eto={eto} />
      <Divider />
      <EtoStatusManager eto={eto} isEmbedded={isEmbedded} />
      <AdditionalInfo
        isEmbedded={isEmbedded}
        publicView={publicView}
        previewCode={eto.previewCode}
        jurisdiction={eto.product.jurisdiction}
      />
    </div>

    {!isEmbedded && url && <EtoInfo eto={eto} url={url} />}
  </Container>
);
