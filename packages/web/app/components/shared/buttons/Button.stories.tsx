import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
  Button,
  ButtonArrowLeft,
  ButtonArrowRight,
  EButtonLayout,
  EButtonSize,
  EButtonWidth,
  EIconPosition,
} from "./Button";

import * as icon from "../../../assets/img/inline_icons/icon_questionmark.svg";

storiesOf("NDS|Atoms/Button", module)
  .add("primary", () => (
    <>
      <Button layout={EButtonLayout.PRIMARY}>Normal</Button>
      <br />
      <br />
      <Button layout={EButtonLayout.PRIMARY} isActive={true}>
        Pressed
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.PRIMARY} autoFocus>
        Focused
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.PRIMARY} disabled>
        Disabled
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.PRIMARY} isLoading />
    </>
  ))
  .add("outline", () => (
    <>
      <Button>Normal</Button>
      <br />
      <br />
      <Button isActive={true}>Pressed</Button>
      <br />
      <br />
      <Button autoFocus>Focused</Button>
      <br />
      <br />
      <Button disabled>Disabled</Button>
      <br />
      <br />
      <Button isLoading />
    </>
  ))
  .add("secondary", () => (
    <>
      <Button layout={EButtonLayout.SECONDARY}>Normal</Button>
      <br />
      <br />
      <Button layout={EButtonLayout.SECONDARY} isActive={true}>
        Pressed
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.SECONDARY} autoFocus>
        Focused
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.SECONDARY} disabled>
        Disabled
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.SECONDARY} isLoading />
    </>
  ))
  .add("ghost", () => (
    <>
      <Button layout={EButtonLayout.GHOST}>Normal</Button>
      <br />
      <br />
      <Button layout={EButtonLayout.GHOST} isActive={true}>
        Pressed
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.GHOST} autoFocus>
        Focused
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.GHOST} disabled>
        Disabled
      </Button>
      <br />
      <br />
      <Button layout={EButtonLayout.GHOST} isLoading />
    </>
  ))
  .add("with icons", () => (
    <>
      <Button layout={EButtonLayout.GHOST} svgIcon={icon} iconPosition={EIconPosition.ICON_BEFORE}>
        icon before text
      </Button>
      <br />
      <Button layout={EButtonLayout.GHOST} svgIcon={icon} iconPosition={EIconPosition.ICON_AFTER}>
        icon after text
      </Button>
    </>
  ))
  .add("with size", () => (
    <>
      {/* Default button */}
      <Button size={EButtonSize.NORMAL}>normal button</Button>
      <br />
      <Button size={EButtonSize.SMALL}>small button</Button>
      <br />
      <Button size={EButtonSize.HUGE}>huge button</Button>
      <br />
      <br />
      {/* Secondary button */}
      <Button layout={EButtonLayout.GHOST} size={EButtonSize.NORMAL}>
        secondary button
      </Button>
      <br />
      <Button layout={EButtonLayout.GHOST} size={EButtonSize.SMALL}>
        secondary small button
      </Button>
      <br />
      <Button layout={EButtonLayout.GHOST} size={EButtonSize.HUGE}>
        secondary huge button
      </Button>
    </>
  ))
  .add("with width", () => (
    <>
      <Button width={EButtonWidth.NORMAL}>normal button</Button>
      <br />
      <br />
      <Button width={EButtonWidth.BLOCK}>block button</Button>
      <br />
      <br />
      <Button width={EButtonWidth.NO_PADDING}>no padding</Button>
    </>
  ));

storiesOf("buttons/ArrowRight", module).add("primary", () => (
  <ButtonArrowRight>primary</ButtonArrowRight>
));

storiesOf("buttons/ArrowLeft", module).add("primary", () => (
  <ButtonArrowLeft>primary</ButtonArrowLeft>
));
