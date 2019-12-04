import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { FormattedHTMLMessage, FormattedMessage } from "react-intl-phraseapp";

import { externalRoutes } from "../../../config/externalRoutes";
import { EKycRequestStatus } from "../../../lib/api/kyc/KycApi.interfaces";
import { LoadingIndicator } from "../../shared/loading-indicator";
import { KycStatusWidgetBase } from "./KycStatusWidget";

const defaultProps = {
  onGoToKycHome: () => {},
  onGoToDashboard: () => {},
  onStartIdNow: () => {},
  step: 1,
  isUserEmailVerified: true,
  backupCodesVerified: true,
  isKycFlowBlockedByRegion: false,
  isRestrictedCountryInvestor: false,
  requestStatus: undefined,
  instantIdStatus: undefined,
  error: undefined,
};

describe("<KycStatusWidgetBase />", () => {
  it("should render verified section", () => {
    const component = shallow(
      <KycStatusWidgetBase
        {...defaultProps}
        requestStatus={EKycRequestStatus.ACCEPTED}
        isLoading={false}
      />,
    );

    expect(component.contains(<FormattedMessage id="settings.kyc-status-widget.status.accepted" />))
      .to.be.true;
  });

  it("should render unverified section", () => {
    const component = shallow(
      <KycStatusWidgetBase
        {...defaultProps}
        requestStatus={EKycRequestStatus.DRAFT}
        isLoading={false}
      />,
    );

    expect(
      component.contains(
        <FormattedHTMLMessage
          tagName="span"
          id="settings.kyc-status-widget.status.draft"
          values={{ url: externalRoutes.neufundSupportHome }}
        />,
      ),
    ).to.be.true;
  });

  it("should render loading indicator", () => {
    const component = shallow(<KycStatusWidgetBase {...defaultProps} isLoading={true} />);
    expect(component.find(LoadingIndicator)).to.have.length(1);
  });
});
