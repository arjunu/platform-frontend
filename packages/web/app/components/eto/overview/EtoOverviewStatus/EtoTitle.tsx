import * as cn from "classnames";
import * as React from "react";
import { Link } from "react-router-dom";

import { EJurisdiction } from "../../../../lib/api/eto/EtoProductsApi.interfaces";
import { TEtoWithCompanyAndContractReadonly } from "../../../../modules/eto/types";
import { etoPublicViewLink } from "../../../appRouteUtils";
import { TokenSymbolWidget } from "./TokenSymbolWidget";

import * as tokenIcon from "../../../../assets/img/token_icon.svg";
import * as styles from "./EtoOverviewStatus.module.scss";

interface IExternalProps {
  isEmbedded: boolean;
}

interface IEtoProp {
  eto: TEtoWithCompanyAndContractReadonly;
}

interface ITitleProps {
  isEmbedded: boolean;
  jurisdiction: EJurisdiction;
  previewCode: string;
}

const EtoTitleWrapper: React.FunctionComponent<ITitleProps> = ({
  isEmbedded,
  previewCode,
  jurisdiction,
  children,
}) => {
  if (isEmbedded) {
    return (
      <Link
        className={cn(styles.etoTitleWrapper)}
        to={etoPublicViewLink(previewCode, jurisdiction)}
        target={"_blank"}
        data-test-id="eto-overview-status-token"
      >
        {children}
      </Link>
    );
  } else {
    return <>{children}</>;
  }
};

export const EtoTitle: React.FunctionComponent<IExternalProps & IEtoProp> = ({
  eto,
  isEmbedded,
}) => (
  <EtoTitleWrapper
    isEmbedded={isEmbedded}
    previewCode={eto.previewCode}
    jurisdiction={eto.product.jurisdiction}
  >
    <TokenSymbolWidget
      brandName={eto.company.brandName}
      tokenImage={{
        alt: eto.equityTokenName || "",
        srcSet: { "1x": eto.equityTokenImage || tokenIcon },
      }}
      tokenName={eto.equityTokenName}
      tokenSymbol={eto.equityTokenSymbol || ""}
    />
  </EtoTitleWrapper>
);
