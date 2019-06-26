import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { lifecycle, withProps } from "recompose";
import { compose } from "redux";

import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { ERequestStatus } from "../../lib/api/KycApi.interfaces";
import { actions } from "../../modules/actions";
import { selectBackupCodesVerified, selectVerifiedUserEmail } from "../../modules/auth/selectors";
import {
  selectCanEnableBookBuilding,
  selectCombinedEtoCompanyData,
  selectIsMarketingDataVisibleInPreview,
  selectIsOfferingDocumentSubmitted,
  selectIssuerEtoOfferingDocumentType,
  selectIssuerEtoWithCompanyAndContract,
  selectIsTermSheetSubmitted,
  userHasKycAndEmailVerified,
} from "../../modules/eto-flow/selectors";
import { calculateMarketingEtoData, calculateSettingsEtoData } from "../../modules/eto-flow/utils";
import { TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { Container, EColumnSpan } from "../layouts/Container";
import { WidgetGridLayout } from "../layouts/Layout";
import { LayoutAuthorized } from "../layouts/LayoutAuthorized";
import { SettingsWidgets } from "../settings/settings-widget/SettingsWidgets";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayoutAuthorized } from "../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { Heading } from "../shared/Heading";
import { LoadingIndicator } from "../shared/loading-indicator";
import { Tooltip } from "../shared/tooltips/Tooltip";
import { BookBuildingWidget } from "./dashboard/bookBuildingWidget/BookBuildingWidget";
import { ChooseEtoStartDateWidget } from "./dashboard/chooseEtoStartDateWidget/ChooseEtoStartDateWidget";
import { ETOFormsProgressSection } from "./dashboard/ETOFormsProgressSection";
import { PublishETOWidget } from "./dashboard/PublishETOWidget";
import { UploadInvestmentAgreement } from "./dashboard/signInvestmentAgreementWidget/UploadInvestmentAgreementWidget.unsafe";
import { SubmitProposalWidget } from "./dashboard/submitProposalWidget/SubmitProposalWidget";
import { UploadInvestmentMemorandum } from "./dashboard/UploadInvestmentMemorandum";
import { UploadProspectusWidget } from "./dashboard/UploadProspectusWidget";
import { UploadTermSheetWidget } from "./dashboard/UploadTermSheetWidget";
import { DashboardHeading } from "./shared/DashboardHeading";
import { EProjectStatusLayout, EProjectStatusSize, ETOState } from "./shared/ETOState";
import { EEtoStep, selectEtoStep } from "./utils";

import * as styles from "./EtoDashboard.module.scss";

const SUBMIT_PROPOSAL_THRESHOLD = 1;

interface IEtoStep {
  etoStep: EEtoStep;
}

interface IStateProps {
  verifiedEmail?: string;
  backupCodesVerified: boolean;
  isLightWallet: boolean;
  userHasKycAndEmailVerified: boolean;
  requestStatus?: ERequestStatus;
  eto?: TEtoWithCompanyAndContract;
  canEnableBookbuilding: boolean;
  marketingFormsProgress?: number;
  etoSettingsFormsProgress?: number;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  offeringDocumentType: EOfferingDocumentType | undefined;
  isMarketingDataVisibleInPreview?: EEtoMarketingDataVisibleInPreview;
}

interface ISubmissionProps {
  shouldViewEtoSettings?: boolean;
  shouldViewSubmissionSection?: boolean;
}

interface IComputedProps extends ISubmissionProps {
  isVerificationSectionDone: boolean;
}

interface IComponentProps extends ISubmissionProps, IEtoStep {
  verifiedEmail?: string;
  isLightWallet: boolean;
  userHasKycAndEmailVerified: boolean;
  requestStatus?: ERequestStatus;
  eto?: TEtoWithCompanyAndContract;
  canEnableBookbuilding: boolean;
  etoFormProgress?: number;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  offeringDocumentType: EOfferingDocumentType | undefined;
  isVerificationSectionDone: boolean;
  isMarketingDataVisibleInPreview?: EEtoMarketingDataVisibleInPreview;
}

interface IDispatchProps {
  initEtoView: () => void;
}

const selectStepComponent = (etoStep: EEtoStep) => {
  switch (etoStep) {
    case EEtoStep.ONE:
      return (
        <DashboardHeading
          step={1}
          title={<FormattedMessage id="eto-dashboard.verification" />}
          data-test-id="eto-dashboard-verification"
        />
      );
    case EEtoStep.TWO:
      return (
        <DashboardHeading
          step={2}
          title={<FormattedMessage id="eto-dashboard.company-informations" />}
          data-test-id="eto-dashboard-company-informations"
        />
      );
    case EEtoStep.THREE:
      return (
        <DashboardHeading
          step={3}
          title={<FormattedMessage id="eto-dashboard.publish-listing" />}
          data-test-id="eto-dashboard-publish-listing"
        />
      );
    case EEtoStep.FOUR:
      return (
        <>
          <DashboardHeading
            step={4}
            title={<FormattedMessage id="eto-dashboard.listing-review" />}
            data-test-id="eto-dashboard-listing-review"
          />
          <FormattedMessage id="eto-dashboard.listing-review.description" />
        </>
      );
    case EEtoStep.FIVE:
      return (
        <>
          <DashboardHeading
            step={5}
            title={<FormattedMessage id="eto-dashboard.setup-eto" />}
            data-test-id="eto-dashboard-setup-eto"
          />
          <FormattedMessage id="eto-dashboard.setup-eto.description" />
        </>
      );
    case EEtoStep.SIX:
      return (
        <DashboardHeading
          step={6}
          title={<FormattedMessage id="eto-dashboard.publish" />}
          data-test-id="eto-dashboard-publish"
        />
      );
    case EEtoStep.SEVEN:
      return (
        <>
          <DashboardHeading
            step={7}
            title={<FormattedMessage id="eto-dashboard.review" />}
            data-test-id="eto-dashboard-review"
          />
          <FormattedMessage id="eto-dashboard.review.description" />
        </>
      );
    case EEtoStep.EIGHT:
      return (
        <DashboardHeading
          step={8}
          title={<FormattedMessage id="eto-dashboard.live" />}
          data-test-id="eto-dashboard-live"
        />
      );
    default:
      return null;
  }
};

const EtoDashboardStepSelector: React.FunctionComponent<IEtoStep> = ({ etoStep }) => (
  <Container columnSpan={EColumnSpan.THREE_COL}>{selectStepComponent(etoStep)}</Container>
);

const SubmitDashBoardSection: React.FunctionComponent<{
  isTermSheetSubmitted?: boolean;
  columnSpan?: EColumnSpan;
}> = ({ isTermSheetSubmitted, columnSpan }) =>
  isTermSheetSubmitted ? (
    <SubmitProposalWidget columnSpan={columnSpan} />
  ) : (
    <UploadTermSheetWidget columnSpan={columnSpan} />
  );

interface IEtoStateRender {
  eto?: TEtoWithCompanyAndContract;
  shouldViewSubmissionSection?: boolean;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  canEnableBookbuilding: boolean;
  offeringDocumentType: EOfferingDocumentType | undefined;
  isMarketingDataVisibleInPreview?: EEtoMarketingDataVisibleInPreview;
  shouldViewEtoSettings?: boolean;
}

const EtoDashboardStateViewComponent: React.FunctionComponent<IEtoStateRender> = ({
  eto,
  shouldViewSubmissionSection,
  isTermSheetSubmitted,
  isOfferingDocumentSubmitted,
  canEnableBookbuilding,
  offeringDocumentType,
  isMarketingDataVisibleInPreview,
  shouldViewEtoSettings,
}) => {
  if (!eto) {
    return (
      <Container columnSpan={EColumnSpan.THREE_COL}>
        <LoadingIndicator />
      </Container>
    );
  }
  const dashboardTitle = (
    <ETOState
      eto={eto}
      isIssuer={true}
      size={EProjectStatusSize.LARGE}
      layout={EProjectStatusLayout.BLACK}
    />
  );

  switch (eto.state) {
    case EEtoState.PREVIEW:
      return (
        <>
          {/*Show actions header only if actions are available*/}
          {((shouldViewEtoSettings &&
            isMarketingDataVisibleInPreview !== EEtoMarketingDataVisibleInPreview.VISIBLE) ||
            shouldViewSubmissionSection) && (
            <Container columnSpan={EColumnSpan.THREE_COL}>
              <DashboardHeading title={<FormattedMessage id="eto-dashboard.available-actions" />} />
            </Container>
          )}

          {shouldViewEtoSettings &&
            !(shouldViewSubmissionSection && isTermSheetSubmitted) &&
            isMarketingDataVisibleInPreview !== EEtoMarketingDataVisibleInPreview.VISIBLE && (
              <PublishETOWidget
                isMarketingDataVisibleInPreview={isMarketingDataVisibleInPreview}
                columnSpan={EColumnSpan.ONE_AND_HALF_COL}
              />
            )}

          {shouldViewSubmissionSection && (
            <SubmitDashBoardSection
              isTermSheetSubmitted={isTermSheetSubmitted}
              columnSpan={EColumnSpan.ONE_AND_HALF_COL}
            />
          )}

          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewEtoSettings} />
        </>
      );
    case EEtoState.PENDING:
      return (
        <>
          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.LISTED:
      return (
        <>
          {canEnableBookbuilding && <BookBuildingWidget columnSpan={EColumnSpan.TWO_COL} />}
          {!isOfferingDocumentSubmitted &&
            (offeringDocumentType === EOfferingDocumentType.PROSPECTUS ? (
              <UploadProspectusWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
            ) : (
              <UploadInvestmentMemorandum columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
            ))}

          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.PROSPECTUS_APPROVED:
      return (
        <>
          {canEnableBookbuilding && <BookBuildingWidget columnSpan={EColumnSpan.TWO_COL} />}
          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.ON_CHAIN:
      return (
        <>
          <UploadInvestmentAgreement columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ChooseEtoStartDateWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    default:
      return (
        <Container columnSpan={EColumnSpan.THREE_COL}>
          <DashboardHeading title={dashboardTitle} />
        </Container>
      );
  }
};

class EtoDashboardComponent extends React.Component<IComponentProps> {
  render(): React.ReactNode {
    const {
      eto,
      canEnableBookbuilding,
      shouldViewEtoSettings,
      isTermSheetSubmitted,
      isOfferingDocumentSubmitted,
      offeringDocumentType,
      isVerificationSectionDone,
      userHasKycAndEmailVerified,
      isMarketingDataVisibleInPreview,
      shouldViewSubmissionSection,
      etoStep,
    } = this.props;

    return (
      <WidgetGridLayout data-test-id="eto-dashboard-application">
        {!isVerificationSectionDone && (
          <>
            <EtoDashboardStepSelector etoStep={etoStep} />
            <SettingsWidgets
              isDynamic={true}
              {...this.props}
              columnSpan={EColumnSpan.ONE_AND_HALF_COL}
            />
          </>
        )}
        {userHasKycAndEmailVerified && (
          <>
            <Container columnSpan={EColumnSpan.THREE_COL} className="mb-5">
              <div className={styles.header}>
                <Heading level={2} decorator={false} disableTransform={true} inheritFont={true}>
                  <FormattedHTMLMessage tagName="span" id="eto-dashboard.header" />
                </Heading>
                {eto && (
                  <ETOState
                    eto={eto}
                    size={EProjectStatusSize.HUGE}
                    layout={EProjectStatusLayout.INHERIT}
                    className="ml-3"
                  />
                )}
              </div>
              <Tooltip
                content={
                  <FormattedHTMLMessage id="eto-dashboard.tooltip.description" tagName="span" />
                }
              >
                <FormattedMessage id="eto-dashboard.tooltip" />
              </Tooltip>
            </Container>
            <EtoDashboardStepSelector etoStep={etoStep} />
            <EtoDashboardStateViewComponent
              isTermSheetSubmitted={isTermSheetSubmitted}
              isOfferingDocumentSubmitted={isOfferingDocumentSubmitted}
              shouldViewEtoSettings={shouldViewEtoSettings}
              shouldViewSubmissionSection={shouldViewSubmissionSection}
              eto={eto}
              canEnableBookbuilding={canEnableBookbuilding}
              offeringDocumentType={offeringDocumentType}
              isMarketingDataVisibleInPreview={isMarketingDataVisibleInPreview}
            />
          </>
        )}
      </WidgetGridLayout>
    );
  }
}

const EtoDashboard = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      verifiedEmail: selectVerifiedUserEmail(s.auth),
      backupCodesVerified: selectBackupCodesVerified(s),
      isLightWallet: selectIsLightWallet(s.web3),
      userHasKycAndEmailVerified: userHasKycAndEmailVerified(s),
      requestStatus: selectKycRequestStatus(s),
      eto: selectIssuerEtoWithCompanyAndContract(s),
      canEnableBookbuilding: selectCanEnableBookBuilding(s),
      isTermSheetSubmitted: selectIsTermSheetSubmitted(s),
      isOfferingDocumentSubmitted: selectIsOfferingDocumentSubmitted(s),
      marketingFormsProgress: calculateMarketingEtoData(selectCombinedEtoCompanyData(s)),
      etoSettingsFormsProgress: calculateSettingsEtoData(selectCombinedEtoCompanyData(s)),
      offeringDocumentType: selectIssuerEtoOfferingDocumentType(s),
      isMarketingDataVisibleInPreview: selectIsMarketingDataVisibleInPreview(s),
    }),
    dispatchToProps: dispatch => ({
      initEtoView: () => {
        dispatch(actions.etoFlow.loadIssuerEto());
        dispatch(actions.kyc.kycLoadIndividualDocumentList());
        dispatch(actions.etoDocuments.loadFileDataStart());
      },
    }),
  }),
  withProps<IComputedProps, IStateProps>(props => {
    const shouldViewEtoSettings = Boolean(
      props.marketingFormsProgress && props.marketingFormsProgress >= SUBMIT_PROPOSAL_THRESHOLD,
    );
    const shouldViewSubmissionSection = Boolean(
      props.etoSettingsFormsProgress && props.etoSettingsFormsProgress >= SUBMIT_PROPOSAL_THRESHOLD,
    );

    const isVerificationSectionDone = props.userHasKycAndEmailVerified && props.backupCodesVerified;

    return {
      isVerificationSectionDone,
      shouldViewEtoSettings,
      shouldViewSubmissionSection,
      etoStep: props.eto
        ? selectEtoStep(
            isVerificationSectionDone,
            props.eto.state,
            shouldViewEtoSettings,
            props.isMarketingDataVisibleInPreview,
            shouldViewSubmissionSection,
            props.isTermSheetSubmitted,
          )
        : EEtoStep.ONE,
    };
  }),
  onEnterAction<IStateProps & IDispatchProps>({
    actionCreator: (_, props) => {
      if (props.userHasKycAndEmailVerified) {
        props.initEtoView();
      }
    },
  }),
  lifecycle<IStateProps & IDispatchProps, {}>({
    componentDidUpdate(nextProps: IStateProps & IDispatchProps): void {
      if (this.props.userHasKycAndEmailVerified !== nextProps.userHasKycAndEmailVerified) {
        this.props.initEtoView();
      }
    },
  }),
  withContainer(LayoutAuthorized),
)(EtoDashboardComponent);

export { EtoDashboard, EtoDashboardComponent, EtoDashboardStateViewComponent };
