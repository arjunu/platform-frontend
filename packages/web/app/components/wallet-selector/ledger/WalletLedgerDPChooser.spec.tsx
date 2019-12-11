import { dummyIntl } from "@neufund/shared";
import { expect } from "chai";
import { mount, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { tid } from "../../../../test/testUtils";
import { DEFAULT_DERIVATION_PATH_PREFIX } from "../../../modules/wallet-selector/ledger-wizard/reducer";
import { DPChooserComponent } from "./WalletLedgerDPChooser";

describe("<DPChooserComponent />", () => {
  const errorMessage = "errorMessage";

  const defaultProps = () => ({
    derivationPathPrefix: DEFAULT_DERIVATION_PATH_PREFIX,
    onDerivationPathPrefixChange: spy(),
    errorMessage: errorMessage,
    intl: dummyIntl,
  });

  it("should render correct derivation path prefix", () => {
    const component = shallow(<DPChooserComponent {...defaultProps()} />);
    const inputValue = component.find('Input[name="derivationPathPrefix"]').prop("value");
    expect(inputValue).to.be.eq(DEFAULT_DERIVATION_PATH_PREFIX);
  });

  it("should render error message if its present", () => {
    const component = mount(<DPChooserComponent {...defaultProps()} />);

    expect(component.find('input[name="derivationPathPrefix"]').hasClass("is-invalid")).to.be.true;
    expect(
      component
        .find(tid("dpChooser-error-msg"))
        .children()
        .text(),
    ).to.be.eq(errorMessage);
  });

  it("should fire onChange function when derivation path is changed", () => {
    const props = defaultProps();
    const component = shallow(<DPChooserComponent {...props} />);
    const inputField = component.find('Input[name="derivationPathPrefix"]');
    inputField.simulate("change", { target: { value: "test" } });
    expect(props.onDerivationPathPrefixChange).to.be.calledOnce;
  });
});
