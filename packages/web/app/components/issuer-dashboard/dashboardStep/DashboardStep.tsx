import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { EOfferingDocumentType } from "../../../lib/api/eto/EtoProductsApi.interfaces";
import { assertNever } from "../../../utils/assertNever";
import { DashboardHeading } from "../../eto/shared/DashboardHeading";
import { Container, EColumnSpan } from "../../layouts/Container";
import { EEtoStep } from "../utils";
import { LinkNomineeStep } from "./LinkNomineeStep";

interface IEtoStep {
  etoStep: EEtoStep;
  offeringDocumentType: EOfferingDocumentType | undefined;
}

const selectStepComponent = (props: IEtoStep) => {
  switch (props.etoStep) {
    case EEtoStep.VERIFICATION:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.verification" />}
          data-test-id="eto-dashboard-verification"
        />
      );
    case EEtoStep.FILL_INFORMATION_ABOUT_COMPANY:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.company-informations" />}
          data-test-id="eto-dashboard-company-informations"
        />
      );
    case EEtoStep.PUBLISH_LISTING_PAGE:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.publish-listing" />}
          data-test-id="eto-dashboard-publish-listing"
        />
      );
    case EEtoStep.LISTING_PAGE_IN_REVIEW:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.listing-review" />}
            data-test-id="eto-dashboard-listing-review"
          />
          <FormattedMessage id="eto-dashboard.listing-review.description" />
        </>
      );
    case EEtoStep.LINK_NOMINEE:
      return <LinkNomineeStep />;
    case EEtoStep.FILL_INFORMATION_ABOUT_ETO:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.fill-information-about-eto" />}
            data-test-id="eto-dashboard-fill-information-about-eto"
          />
          <FormattedMessage id="eto-dashboard.fill-information-about-eto.description" />
        </>
      );
    case EEtoStep.UPLOAD_SIGNED_TERMSHEET:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.upload-signed-termsheet" />}
            data-test-id="eto-dashboard-upload-signed-termsheet"
          />
          <FormattedMessage id="eto-dashboard.upload-signed-termsheet.description" />
        </>
      );
    case EEtoStep.PUBLISH_INVESTMENT_OFFER:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.publish" />}
          data-test-id="eto-dashboard-publish"
        />
      );
    case EEtoStep.INVESTMENT_OFFER_IN_REVIEW:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.review" />}
            data-test-id="eto-dashboard-review"
          />
          <FormattedMessage id="eto-dashboard.review.description" />
        </>
      );
    case EEtoStep.UPLOAD_OFFERING_DOCUMENT: {
      switch (props.offeringDocumentType) {
        case EOfferingDocumentType.PROSPECTUS:
          return (
            <DashboardHeading
              title={<FormattedMessage id="eto-dashboard.upload-prospectus-document" />}
              data-test-id="eto-dashboard-upload-prospectus-document"
            />
          );
        case EOfferingDocumentType.MEMORANDUM:
          return (
            <DashboardHeading
              title={<FormattedMessage id="eto-dashboard.upload-memorandum-document" />}
              data-test-id="eto-dashboard-upload-memorandum-document"
            />
          );
        default:
          throw new Error(`Invalid offering document type (${props.offeringDocumentType})`);
      }
    }
    case EEtoStep.UPLOAD_ISHA:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.upload-isha" />}
          data-test-id="eto-dashboard-upload-isha"
        />
      );
    case EEtoStep.WAIT_FOR_SMART_CONTRACT:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.waiting-for-smart-contracts" />}
            data-test-id="eto-dashboard-waiting-for-smart-contracts"
          />
          <FormattedMessage id="eto-dashboard.waiting-for-smart-contracts.description" />
        </>
      );
    case EEtoStep.WAIT_FOR_NOMINEE_AGREEMENTS:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.waiting-for-nominee-documents" />}
            data-test-id="eto-dashboard-waiting-for-nominee-agreements"
          />
          <FormattedMessage id="eto-dashboard.waiting-for-nominee-documents.description" />
        </>
      );
    case EEtoStep.SETUP_START_DATE:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.setup-start-date" />}
          data-test-id="eto-dashboard-set-start-date"
        />
      );

    case EEtoStep.WAITING_FOR_FUNDRAISING_TO_START:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.waiting-for-fundraising-start" />}
        />
      );

    case EEtoStep.FUNDRAISING_IS_LIVE:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.fundraising-live" />}
          data-test-id="eto-dashboard-fundraising-live"
        />
      );

    case EEtoStep.SIGN_YOUR_ISHA:
      return (
        <DashboardHeading
          title={<FormattedMessage id="eto-dashboard.sign-your-isha" />}
          data-test-id="eto-dashboard-sign-you-isha"
        />
      );

    case EEtoStep.ETO_SUSPENDED_FROM_ON_CHAIN:
      return (
        <>
          <DashboardHeading
            title={<FormattedMessage id="eto-dashboard.suspended" />}
            data-test-id="eto-dashboard-suspended"
          />
          <FormattedMessage id="eto-dashboard.eto-contracts-suspended" />
        </>
      );
    default:
      return assertNever(props.etoStep);
  }
};

const DashboardStep: React.FunctionComponent<IEtoStep> = props => (
  <Container columnSpan={EColumnSpan.ONE_AND_HALF_COL}>{selectStepComponent(props)}</Container>
);

export { DashboardStep };
