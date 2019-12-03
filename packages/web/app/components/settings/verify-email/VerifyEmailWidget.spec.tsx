import { expect } from "chai";
import { render, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { createMount } from "../../../../test/createMount";
import {
  setupFakeClock,
  waitUntilDoesntThrow,
  wrapWithIntl,
} from "../../../../test/integrationTestUtils.unsafe";
import { tid } from "../../../../test/testUtils";
import { VerifyEmailWidgetBase } from "./VerifyEmailWidget";

describe("<VerifyEmailWidgetBase />", () => {
  const clock = setupFakeClock();

  it("should render verified section", () => {
    const verifyEmailWidget = shallow(
      <VerifyEmailWidgetBase
        step={1}
        revertCancelEmail={() => {}}
        isThereUnverifiedEmail={false}
        isUserEmailVerified={true}
        resendEmail={() => {}}
        isEmailTemporaryCancelled={false}
        abortEmailUpdate={() => {}}
        cancelEmail={() => {}}
        addNewEmail={() => {}}
      />,
    );
    expect(verifyEmailWidget.find(tid("unverified-section"))).to.have.length(0);
    expect(verifyEmailWidget.find(tid("verified-section"))).to.have.length(1);
  });

  it("should render unverified section", () => {
    const verifyEmailWidget = shallow(
      <VerifyEmailWidgetBase
        step={1}
        isThereUnverifiedEmail={true}
        isUserEmailVerified={false}
        cancelEmail={() => {}}
        revertCancelEmail={() => {}}
        isEmailTemporaryCancelled={false}
        resendEmail={() => {}}
        addNewEmail={() => {}}
        abortEmailUpdate={() => {}}
      />,
    );
    expect(verifyEmailWidget.find(tid("unverified-section"))).to.have.length(1);
    expect(verifyEmailWidget.find(tid("verified-section"))).to.have.length(0);
  });

  it("should not render resend link button", () => {
    const verifyEmailWidget = shallow(
      <VerifyEmailWidgetBase
        step={1}
        isThereUnverifiedEmail={false}
        isEmailTemporaryCancelled={false}
        isUserEmailVerified={false}
        revertCancelEmail={() => {}}
        cancelEmail={() => {}}
        resendEmail={() => {}}
        addNewEmail={() => {}}
        abortEmailUpdate={() => {}}
      />,
    );
    expect(verifyEmailWidget.find(tid("resend-link"))).to.have.length(0);
  });

  it("should render resend link button", () => {
    const verifyEmailWidget = render(
      wrapWithIntl(
        <VerifyEmailWidgetBase
          step={1}
          isEmailTemporaryCancelled={false}
          isThereUnverifiedEmail={true}
          isUserEmailVerified={false}
          unverifiedEmail="test@test.com"
          revertCancelEmail={() => {}}
          cancelEmail={() => {}}
          resendEmail={() => {}}
          addNewEmail={() => {}}
          abortEmailUpdate={() => {}}
        />,
      ),
    );
    expect(verifyEmailWidget.find(tid("resend-link"))).to.have.length(1);
  });

  describe("email form", () => {
    it("initially submit button should be disabled", () => {
      const verifyEmailWidget = createMount(
        wrapWithIntl(
          <VerifyEmailWidgetBase
            step={1}
            isThereUnverifiedEmail={false}
            isEmailTemporaryCancelled={false}
            cancelEmail={() => {}}
            isUserEmailVerified={false}
            resendEmail={() => {}}
            revertCancelEmail={() => {}}
            addNewEmail={() => {}}
            abortEmailUpdate={() => {}}
          />,
        ),
      );

      expect(
        verifyEmailWidget
          .find(tid("verify-email-widget-form-submit"))
          .first()
          .prop("disabled"),
      ).to.be.true;
    });

    it("should be possible to submit with valid email", async () => {
      const addNewEmailSpy = spy();
      const verifyEmailWidget = createMount(
        wrapWithIntl(
          <VerifyEmailWidgetBase
            step={1}
            isThereUnverifiedEmail={false}
            isUserEmailVerified={false}
            isEmailTemporaryCancelled={false}
            revertCancelEmail={() => {}}
            cancelEmail={() => {}}
            resendEmail={() => {}}
            addNewEmail={addNewEmailSpy}
            abortEmailUpdate={() => {}}
          />,
        ),
      );

      verifyEmailWidget
        .find(tid("verify-email-widget-form-email-input"))
        .last()
        .simulate("change", {
          target: {
            name: "email",
            value: "valid@email.com",
          },
        });

      expect(
        verifyEmailWidget
          .find(tid("verify-email-widget-form-submit"))
          .first()
          .prop("disabled"),
      ).to.be.undefined;

      verifyEmailWidget.find("form").simulate("submit");

      await waitUntilDoesntThrow(
        clock.fakeClock,
        () => {
          expect(addNewEmailSpy).to.be.calledOnce;
        },
        "Form callback should be called",
      );
    });

    it("should not be possible to submit with invalid email", async () => {
      const verifyEmailWidget = createMount(
        wrapWithIntl(
          <VerifyEmailWidgetBase
            step={1}
            isThereUnverifiedEmail={false}
            cancelEmail={() => {}}
            isUserEmailVerified={false}
            revertCancelEmail={() => {}}
            isEmailTemporaryCancelled={false}
            resendEmail={() => {}}
            addNewEmail={() => {}}
            abortEmailUpdate={() => {}}
          />,
        ),
      );

      verifyEmailWidget
        .find(tid("verify-email-widget-form-email-input"))
        .last()
        .simulate("change", {
          target: {
            name: "email",
            value: "not-valid",
          },
        });

      await waitUntilDoesntThrow(
        clock.fakeClock,
        () => {
          verifyEmailWidget.update();
          expect(
            verifyEmailWidget
              .find(tid("verify-email-widget-form-submit"))
              .first()
              .prop("disabled"),
          ).to.be.true;
        },
        "Form submit should be disabled!",
      );
    });
  });
});
