import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { EJurisdiction } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { EUserType } from "../../../lib/api/users/interfaces";
import { selectUserType } from "../../../modules/auth/selectors";
import { selectIssuerEtoPreviewCode } from "../../../modules/eto-flow/selectors";
import { TEtoWithCompanyAndContractReadonly } from "../../../modules/eto/types";
import { appConnect } from "../../../store";
import { TDataTestId } from "../../../types";
import { selectBaseUrl } from "../../../utils/locationUtils";
import { Container, EColumnSpan } from "../../layouts/Container";
import { ExternalLink } from "../../shared/links/ExternalLink";

import * as infoIcon from "../../../assets/img/notifications/info.svg";
import * as styles from "./CoverBanner.module.scss";

interface IExternalProps {
  eto: TEtoWithCompanyAndContractReadonly;
  publicView: boolean;
}

interface IJurisdictionBannerProps {
  jurisdiction?: EJurisdiction;
}

interface IInvestorPreviewProps {
  previewCode?: string;
  origin: string;
}

type TBannerProps = IInvestorPreviewProps | IJurisdictionBannerProps;

const BannerBase: React.FunctionComponent<TDataTestId> = ({
  children,
  "data-test-id": dataTestId,
}) => (
  <Container
    columnSpan={EColumnSpan.THREE_COL}
    className={styles.jurisdictionBanner}
    data-test-id={dataTestId}
  >
    <img src={infoIcon} className={styles.icon} alt="" />
    {children}
  </Container>
);

export const InvestorCoverBannerLayout: React.FunctionComponent<IJurisdictionBannerProps> = ({
  jurisdiction,
}) => {
  switch (jurisdiction) {
    case EJurisdiction.GERMANY:
      return (
        <BannerBase data-test-id={`eto.public-view.jurisdiction-banner.${jurisdiction}`}>
          <FormattedMessage id="eto-overview.cover-banner.jurisdiction.de" />
        </BannerBase>
      );
    case EJurisdiction.LIECHTENSTEIN:
      return (
        <BannerBase data-test-id={`eto.public-view.jurisdiction-banner.${jurisdiction}`}>
          <FormattedMessage id="eto-overview.cover-banner.jurisdiction.li" />
        </BannerBase>
      );
    default:
      return null;
  }
};

export const IssuerBannerLayout: React.FunctionComponent<IInvestorPreviewProps> = ({
  previewCode,
  origin,
}) => (
  <BannerBase data-test-id="eto.public-view.investor-preview-banner">
    <FormattedMessage
      tagName="span"
      id="eto-overview.cover-banner.go-to-investor-view"
      values={{
        viewAsInvestor: (
          <ExternalLink
            data-test-id="eto.public-view.investor-preview-banner.view-as-investor"
            href={`${origin}/eto/view/${previewCode}`}
          >
            <FormattedMessage id="eto-overview.cover-banner.view-as-investor" />
          </ExternalLink>
        ),
      }}
    />
  </BannerBase>
);

export const CoverBanner = compose<TBannerProps, IExternalProps & TBannerProps>(
  appConnect<TBannerProps, {}, IExternalProps>({
    stateToProps: (state, props) => {
      const userType = selectUserType(state);

      if (userType === EUserType.ISSUER && !props.publicView) {
        return {
          userType,
          origin: selectBaseUrl(),
          previewCode: selectIssuerEtoPreviewCode(state),
        };
      } else {
        return {
          userType,
          jurisdiction: props.eto.product.jurisdiction,
        };
      }
    },
  }),
  branch<{ userType: EUserType; publicView: boolean }>(
    props => props.userType === EUserType.ISSUER && !props.publicView,
    renderComponent(IssuerBannerLayout),
  ),
)(InvestorCoverBannerLayout);
