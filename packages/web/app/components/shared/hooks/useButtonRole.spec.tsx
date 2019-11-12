import { expect } from "chai";
import { shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { EKeys } from "../../../utils/enums/keysEnum";
import { useButtonRole } from "./useButtonRole";

type TExternalProps = {
  onClick?: (event: React.SyntheticEvent<unknown>) => void;
};

const TestComponent: React.FunctionComponent<TExternalProps> = ({ onClick }) => {
  const buttonRoleProps = useButtonRole(onClick);

  return <div {...buttonRoleProps} />;
};

describe("useButtonRole", () => {
  it("should attach on click correctly", async () => {
    const onClickSpy = spy();

    const component = shallow(<TestComponent onClick={onClickSpy} />);

    component.simulate("click");

    expect(onClickSpy).to.be.calledOnce;
  });

  it("should call on click only when pressed enter or space", async () => {
    const onClickSpy = spy();

    const component = shallow(<TestComponent onClick={onClickSpy} />);

    // on ENTER key
    const keyDownEnterPreventDefaultSpy = spy();
    const keyDownEnter = { key: EKeys.ENTER, preventDefault: keyDownEnterPreventDefaultSpy };

    component.simulate("keyDown", keyDownEnter);

    expect(onClickSpy).to.be.calledOnceWith(keyDownEnter);
    expect(keyDownEnterPreventDefaultSpy).to.be.calledOnce;

    onClickSpy.resetHistory();

    // on SPACE key
    const keyDownSpacePreventDefaultSpy = spy();
    const keyDownSpace = { key: EKeys.ENTER, preventDefault: keyDownSpacePreventDefaultSpy };

    component.simulate("keyDown", keyDownSpace);

    expect(onClickSpy).to.be.calledOnceWith(keyDownSpace);
    expect(keyDownSpacePreventDefaultSpy).to.be.calledOnce;

    onClickSpy.resetHistory();

    // other keys
    component.simulate("keyDown", { key: "Alt" });
    component.simulate("keyDown", { key: "a" });
    component.simulate("keyDown", { key: "4" });
    expect(onClickSpy).not.to.be.called;
  });

  it("should add role and tabindex", async () => {
    const onClickSpy = spy();

    const component = shallow(<TestComponent onClick={onClickSpy} />);

    expect(component.find("div").props()).to.contain({ role: "button", tabIndex: 0 });
  });

  it("should not add role and tabindex when onClick is not defined", async () => {
    const component = shallow(<TestComponent onClick={undefined} />);

    expect(component.find("div").props()).to.be.empty;
  });
});
