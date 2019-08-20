import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { TMockEto } from "../../../../data/etoCompanies";
import { TEtoWithCompanyAndContract } from "../../../../modules/eto/types";
import { isComingSoon } from "../../../../modules/eto/utils";
import { routingActions } from "../../../../modules/routing/actions";
import { appConnect } from "../../../../store";
import { CommonHtmlProps, XOR } from "../../../../types";
import { appRoutes } from "../../../appRoutes";
import { etoPublicViewLink } from "../../../appRouteUtils";
import { EHeadingSize, Heading } from "../../../shared/Heading";
import { FUNDING_ROUNDS } from "../../constants";
import { ComingSoonEtoState, ETOInvestorState, SuccessEtoState } from "../../shared/ETOState";
import { Cover } from "./Cover";
import { EtoCardButton, EtoCardPanelButton } from "./EtoCardPanel";
import { EtoStatusManager, SuccessfulInfo } from "./EtoStatusManager";

import * as styles from "./EtoOverviewThumbnail.module.scss";

type TMockEtoProps = {
  mockedEto: TMockEto;
};

type TEtoProps = {
  eto: TEtoWithCompanyAndContract;
};

type TCommonExternalProps = { shouldOpenInNewWindow?: boolean };

type TExternalProps = XOR<TEtoProps, TMockEtoProps> & TCommonExternalProps;

interface IDispatchProps {
  openEtoView: (url: string) => void;
}

const defaultEmpty = "-";

const MockEtoOverviewLayout: React.FunctionComponent<
  TMockEtoProps & CommonHtmlProps & IDispatchProps
> = ({ mockedEto, openEtoView }) => (
  <EtoCardPanelButton
    data-test-id={`eto-overview-${mockedEto.id}`}
    onClick={() => openEtoView(mockedEto.url)}
  >
    <Cover
      className={styles.cover}
      companyBanner={{
        alt: mockedEto.brandName,
        srcSet: {
          "1x": mockedEto.companyPreviewCardBanner,
        },
      }}
      tags={mockedEto.categories}
      jurisdiction={undefined}
    />

    {mockedEto.totalAmount ? (
      <SuccessEtoState className={styles.statusOfEto} />
    ) : (
      <ComingSoonEtoState className={styles.statusOfEto} />
    )}

    <section className={styles.content}>
      <Heading titleClassName="text-truncate" decorator={false} level={2} size={EHeadingSize.HUGE}>
        {mockedEto.brandName}
      </Heading>

      <p data-test-id="eto-overview-status-founders-quote" className={styles.quote}>
        {mockedEto.keyQuoteFounder}
      </p>

      {!!mockedEto.totalAmount && <SuccessfulInfo totalAmount={mockedEto.totalAmount} />}
    </section>
  </EtoCardPanelButton>
);

const EtoOverviewLayoutBase: React.FunctionComponent<TEtoProps> = ({ eto }) => (
  <>
    <Cover
      className={styles.cover}
      companyBanner={{
        alt: eto.company.brandName,
        srcSet: {
          "1x": eto.company.companyPreviewCardBanner,
        },
      }}
      tags={eto.company.categories}
      jurisdiction={eto.product.jurisdiction}
    />

    <ETOInvestorState className={styles.statusOfEto} eto={eto} />

    <section className={styles.content}>
      <Heading titleClassName="text-truncate" decorator={false} level={2} size={EHeadingSize.HUGE}>
        {eto.company.brandName}
      </Heading>

      {isComingSoon(eto.state) ? (
        <p data-test-id="eto-overview-status-founders-quote" className={styles.quote}>
          {eto.company.keyQuoteFounder}
        </p>
      ) : (
        <>
          <div className={styles.groupWrapper}>
            <div className={styles.group}>
              <span className={styles.label}>
                <FormattedMessage id="eto-overview-thumbnail.token-name" />
              </span>
              <span className={styles.value}>
                {eto.equityTokenName} ({eto.equityTokenSymbol})
              </span>
            </div>

            <div className={styles.group}>
              <span className={styles.label}>
                <FormattedMessage id="eto-overview-thumbnail.funding-round" />
              </span>
              <span className={styles.value}>
                {eto.company.companyStage ? FUNDING_ROUNDS[eto.company.companyStage] : defaultEmpty}
              </span>
            </div>

            <div className={styles.group}>
              <span className={styles.label}>
                <FormattedMessage id="eto-overview-thumbnail.headquarters" />
              </span>
              <span className={styles.value}>{eto.company.city || defaultEmpty}</span>
            </div>
          </div>

          <EtoStatusManager eto={eto} />
        </>
      )}
    </section>
  </>
);

const EtoOverviewGridLayout: React.FunctionComponent<
  TEtoProps & CommonHtmlProps & IDispatchProps
> = ({ eto, openEtoView }) => (
  <EtoCardPanelButton
    data-test-id={`eto-overview-${eto.etoId}`}
    onClick={() => openEtoView(etoPublicViewLink(eto.previewCode, eto.product.jurisdiction))}
  >
    <EtoOverviewLayoutBase eto={eto} />
  </EtoCardPanelButton>
);

const EtoOverviewComponent: React.FunctionComponent<
  TEtoProps & CommonHtmlProps & IDispatchProps
> = ({ eto, openEtoView }) => (
  <EtoCardButton
    data-test-id={`eto-overview-${eto.etoId}`}
    onClick={() => openEtoView(appRoutes.etoIssuerView)}
  >
    <EtoOverviewLayoutBase eto={eto} />
  </EtoCardButton>
);

const connectEtoOverviewThumbnail = <T extends {}>(
  WrappedComponent: React.ComponentType<TEtoProps & CommonHtmlProps & IDispatchProps & T>,
) =>
  compose<
    TEtoProps & CommonHtmlProps & IDispatchProps & T,
    TExternalProps & TCommonExternalProps & CommonHtmlProps
  >(
    appConnect<{}, IDispatchProps, TCommonExternalProps>({
      dispatchToProps: (dispatch, { shouldOpenInNewWindow }) => ({
        openEtoView: (url: string) =>
          dispatch(
            shouldOpenInNewWindow ? routingActions.openInNewWindow(url) : routingActions.push(url),
          ),
      }),
    }),
    branch<TExternalProps>(props => !!props.mockedEto, renderComponent(MockEtoOverviewLayout)),
  )(WrappedComponent);

const EtoOverviewThumbnail = connectEtoOverviewThumbnail(EtoOverviewGridLayout);
const NomineeEtoOverviewThumbnail = connectEtoOverviewThumbnail(EtoOverviewComponent);

export { EtoOverviewGridLayout, EtoOverviewThumbnail, NomineeEtoOverviewThumbnail };