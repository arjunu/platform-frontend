import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";
import { lifecycle, withProps } from "recompose";
import { compose } from "redux";

import {
  EEtoMarketingDataVisibleInPreview,
  EEtoState,
} from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { EOfferingDocumentType } from "../../lib/api/eto/EtoProductsApi.interfaces";
import { EKycRequestStatus } from "../../lib/api/kyc/KycApi.interfaces";
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
import {
  calculateInvestmentAndEtoTermsEtoData,
  calculateMarketingEtoData,
  calculateVotingRightsEtoData,
} from "../../modules/eto-flow/utils";
import { TEtoWithCompanyAndContract } from "../../modules/eto/types";
import { selectKycRequestStatus } from "../../modules/kyc/selectors";
import { selectIsLightWallet } from "../../modules/web3/selectors";
import { appConnect } from "../../store";
import { onEnterAction } from "../../utils/OnEnterAction";
import { withContainer } from "../../utils/withContainer.unsafe";
import { DashboardHeading } from "../eto/shared/DashboardHeading";
import { EProjectStatusLayout, EProjectStatusSize, ETOIssuerState } from "../eto/shared/ETOState";
import { Container, EColumnSpan } from "../layouts/Container";
import { Layout } from "../layouts/Layout";
import { WidgetGrid } from "../layouts/WidgetGrid";
import { SettingsWidgets } from "../settings/settings-widget/SettingsWidgets";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { Heading } from "../shared/Heading";
import { LoadingIndicator } from "../shared/loading-indicator/index";
import { Tooltip } from "../shared/tooltips/Tooltip";
import { BookBuildingWidget } from "./bookBuildingWidget/BookBuildingWidget";
import { ChooseEtoStartDateWidget } from "./chooseEtoStartDateWidget/ChooseEtoStartDateWidget";
import { DashboardStep } from "./dashboardStep/DashboardStep";
import { ETOFormsProgressSection } from "./ETOFormsProgressSection";
import { PublishETOWidget } from "./PublishETOWidget";
import { UploadInvestmentAgreement } from "./signInvestmentAgreementWidget/UploadInvestmentAgreementWidget.unsafe";
import { SubmitProposalWidget } from "./submitProposalWidget/SubmitProposalWidget";
import { UploadInvestmentMemorandum } from "./UploadInvestmentMemorandum";
import { UploadProspectusWidget } from "./UploadProspectusWidget";
import { UploadTermSheetWidget } from "./UploadTermSheetWidget";
import { EEtoStep, selectEtoStep } from "./utils";

import * as styles from "./EtoDashboard.module.scss";

const SUBMIT_PROPOSAL_THRESHOLD = 1;

interface IStateProps {
  verifiedEmail?: string;
  backupCodesVerified: boolean;
  isLightWallet: boolean;
  userHasKycAndEmailVerified: boolean;
  requestStatus?: EKycRequestStatus;
  eto?: TEtoWithCompanyAndContract;
  canEnableBookbuilding: boolean;
  combinedEtoCompanyData: ReturnType<typeof selectCombinedEtoCompanyData>;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  offeringDocumentType: EOfferingDocumentType | undefined;
  isMarketingDataVisibleInPreview?: EEtoMarketingDataVisibleInPreview;
}

interface IComputedProps {
  isVerificationSectionDone: boolean;
  shouldViewEtoSettings: boolean;
  shouldViewSubmissionSection: boolean;
  shouldViewMarketingSubmissionSection: boolean;
  etoStep: EEtoStep;
}

type TVerificationSection = Omit<IStateProps, "combinedEtoCompanyData"> &
  Omit<IComputedProps, "isVerificationSectionDone">;

interface IDispatchProps {
  initEtoView: () => void;
}

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
  eto: TEtoWithCompanyAndContract;
  shouldViewSubmissionSection?: boolean;
  isTermSheetSubmitted?: boolean;
  isOfferingDocumentSubmitted?: boolean;
  canEnableBookbuilding: boolean;
  offeringDocumentType: EOfferingDocumentType | undefined;
  shouldViewEtoSettings: boolean;
  shouldViewMarketingSubmissionSection: boolean;
}

const EtoDashboardStateViewComponent: React.FunctionComponent<IEtoStateRender> = ({
  eto,
  shouldViewSubmissionSection,
  isTermSheetSubmitted,
  isOfferingDocumentSubmitted,
  canEnableBookbuilding,
  offeringDocumentType,
  shouldViewEtoSettings,
  shouldViewMarketingSubmissionSection,
}) => {
  const dashboardTitle = (
    <ETOIssuerState eto={eto} size={EProjectStatusSize.LARGE} layout={EProjectStatusLayout.BLACK} />
  );

  switch (eto.state) {
    case EEtoState.PREVIEW:
      return (
        <>
          {/*Show actions header only if actions are available*/}
          {(shouldViewMarketingSubmissionSection || shouldViewSubmissionSection) && (
            <Container columnSpan={EColumnSpan.THREE_COL}>
              <DashboardHeading title={<FormattedMessage id="eto-dashboard.available-actions" />} />
            </Container>
          )}

          {shouldViewMarketingSubmissionSection && (
            <PublishETOWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
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
          {canEnableBookbuilding && (
            <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          )}
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
          {canEnableBookbuilding && (
            <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          )}
          <ETOFormsProgressSection shouldViewEtoSettings={shouldViewSubmissionSection} />
        </>
      );
    case EEtoState.ON_CHAIN:
      return (
        <>
          <UploadInvestmentAgreement columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          {canEnableBookbuilding && (
            <BookBuildingWidget columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
          )}
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

const VerificationSection: React.FunctionComponent<TVerificationSection> = ({
  etoStep,
  ...props
}) => (
  <>
    <Container columnSpan={EColumnSpan.THREE_COL}>
      <DashboardStep etoStep={etoStep} />
    </Container>
    <SettingsWidgets isDynamic={true} {...props} columnSpan={EColumnSpan.ONE_AND_HALF_COL} />
  </>
);

const VerifiedUserSection: React.FunctionComponent<TVerificationSection> = ({
  canEnableBookbuilding,
  eto,
  etoStep,
  isOfferingDocumentSubmitted,
  isTermSheetSubmitted,
  offeringDocumentType,
  shouldViewEtoSettings,
  shouldViewMarketingSubmissionSection,
  shouldViewSubmissionSection,
}) => {
  if (eto) {
    return (
      <>
        <Container columnSpan={EColumnSpan.THREE_COL} className="mb-5">
          <div className={styles.header}>
            <Heading level={2} decorator={false} disableTransform={true} inheritFont={true}>
              <FormattedHTMLMessage tagName="span" id="eto-dashboard.header" />
            </Heading>
            {eto && (
              <ETOIssuerState
                eto={eto}
                size={EProjectStatusSize.HUGE}
                layout={EProjectStatusLayout.INHERIT}
                className="ml-3"
              />
            )}
          </div>
          <Tooltip
            content={<FormattedHTMLMessage id="eto-dashboard.tooltip.description" tagName="span" />}
          >
            <FormattedMessage id="eto-dashboard.tooltip" />
          </Tooltip>
        </Container>

        <Container columnSpan={EColumnSpan.THREE_COL}>
          <DashboardStep etoStep={etoStep} />
        </Container>

        <EtoDashboardStateViewComponent
          isTermSheetSubmitted={isTermSheetSubmitted}
          isOfferingDocumentSubmitted={isOfferingDocumentSubmitted}
          shouldViewEtoSettings={shouldViewEtoSettings}
          shouldViewSubmissionSection={shouldViewSubmissionSection}
          eto={eto}
          canEnableBookbuilding={canEnableBookbuilding}
          offeringDocumentType={offeringDocumentType}
          shouldViewMarketingSubmissionSection={shouldViewMarketingSubmissionSection}
        />
      </>
    );
  } else {
    return (
      <Container columnSpan={EColumnSpan.THREE_COL}>
        <LoadingIndicator />
      </Container>
    );
  }
};

const EtoDashboardLayout: React.FunctionComponent<
  Omit<IStateProps, "combinedEtoCompanyData"> & IComputedProps
> = props => {
  const { isVerificationSectionDone, ...rest } = props;

  return (
    <WidgetGrid data-test-id="eto-dashboard-application">
      {isVerificationSectionDone ? (
        <VerifiedUserSection {...rest} />
      ) : (
        <VerificationSection {...rest} />
      )}
    </WidgetGrid>
  );
};

const EtoDashboard = compose<React.FunctionComponent>(
  createErrorBoundary(ErrorBoundaryLayout),
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
      combinedEtoCompanyData: selectCombinedEtoCompanyData(s),
      offeringDocumentType: selectIssuerEtoOfferingDocumentType(s),
      isMarketingDataVisibleInPreview: selectIsMarketingDataVisibleInPreview(s),
    }),
    dispatchToProps: dispatch => ({
      initEtoView: () => {
        dispatch(actions.etoFlow.loadIssuerEto());
        dispatch(actions.kyc.kycLoadIndividualDocumentList());
      },
    }),
  }),
  withProps<IComputedProps, IStateProps>(props => {
    const marketingFormsProgress = calculateMarketingEtoData(props.combinedEtoCompanyData);
    const etoInvestmentAndEtoTermsFormsProgress = calculateInvestmentAndEtoTermsEtoData(
      props.combinedEtoCompanyData,
    );
    const etoVotingRightsFormProgress = calculateVotingRightsEtoData(props.combinedEtoCompanyData);

    const shouldViewEtoSettings = marketingFormsProgress >= SUBMIT_PROPOSAL_THRESHOLD;

    const isInvestmentAndEtoTermsFilledWithAllRequired =
      etoInvestmentAndEtoTermsFormsProgress >= SUBMIT_PROPOSAL_THRESHOLD;

    const isVotingRightsFilledWithAllRequired =
      etoVotingRightsFormProgress >= SUBMIT_PROPOSAL_THRESHOLD;

    const shouldViewSubmissionSection =
      isInvestmentAndEtoTermsFilledWithAllRequired && isVotingRightsFilledWithAllRequired;

    const isVerificationSectionDone = props.userHasKycAndEmailVerified && props.backupCodesVerified;

    const shouldViewMarketingSubmissionSection =
      shouldViewEtoSettings &&
      !(shouldViewSubmissionSection && props.isTermSheetSubmitted) &&
      props.isMarketingDataVisibleInPreview === EEtoMarketingDataVisibleInPreview.NOT_VISIBLE;

    return {
      isVerificationSectionDone,
      shouldViewEtoSettings,
      shouldViewSubmissionSection,
      shouldViewMarketingSubmissionSection,
      etoStep: props.eto
        ? selectEtoStep(
            isVerificationSectionDone,
            props.eto.state,
            shouldViewEtoSettings,
            props.isMarketingDataVisibleInPreview,
            props.isTermSheetSubmitted,
            isVotingRightsFilledWithAllRequired,
            isInvestmentAndEtoTermsFilledWithAllRequired,
          )
        : EEtoStep.VERIFICATION,
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
  withContainer(Layout),
)(EtoDashboardLayout);

export { EtoDashboard, EtoDashboardLayout, EtoDashboardStateViewComponent };