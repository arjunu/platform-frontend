import { expect } from "chai";
import { mount } from "enzyme";
import * as React from "react";

import { wrapWithIntl } from "../../../../../../../test/integrationTestUtils.unsafe";
import { tid } from "../../../../../../../test/testUtils";
import { formWrapper } from "../../../../../shared/forms/fields/testingUtils.unsafe";
import { EtherAddressFormRow } from "./EtherAddressFormRow";

describe("EtherAddressFormRow", () => {
  describe("Etherscan Address Link - Success Icon", () => {
    const dummyAddress = "0x";
    const etherscanAddressLinkTid = tid(`etherscan-address.${dummyAddress}`);
    const successIconTid = tid("input-layout.icon");

    it("should render if address is valid", () => {
      const Component = formWrapper({})(() => (
        <EtherAddressFormRow errors={{}} values={{ to: dummyAddress }} />
      ));
      const component = mount(wrapWithIntl(<Component />));
      expect(component.find(etherscanAddressLinkTid).exists()).to.be.true;
      expect(component.find(successIconTid).exists()).to.be.true;
    });
    it("should not render if address is invalid", () => {
      const Component = formWrapper({})(() => (
        <EtherAddressFormRow errors={{ to: "failure message" }} values={{ to: dummyAddress }} />
      ));
      const component = mount(wrapWithIntl(<Component />));
      expect(component.find(etherscanAddressLinkTid).exists()).to.be.false;
      expect(component.find(successIconTid).exists()).to.be.false;
    });
    it("should not render if address is not entered", () => {
      const Component = formWrapper({})(() => <EtherAddressFormRow errors={{}} values={{}} />);
      const component = mount(wrapWithIntl(<Component />));
      expect(component.find(etherscanAddressLinkTid).exists()).to.be.false;
      expect(component.find(successIconTid).exists()).to.be.false;
    });
  });
});
