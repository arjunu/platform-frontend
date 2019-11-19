import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Button, EButtonLayout, EButtonSize, EButtonWidth, EIconPosition } from "./Button";

import * as icon from "../../../assets/img/inline_icons/download.svg";

type TGenerateStoryProps = {
  layout: EButtonLayout;
  size: EButtonSize;
  width: EButtonWidth;
};

const GenerateStory: React.FunctionComponent<TGenerateStoryProps> = ({ layout, size, width }) => (
  <>
    <Button layout={layout} size={size} width={width}>
      Normal
    </Button>
    <br />
    <br />
    <Button layout={layout} isActive={true} size={size} width={width}>
      Pressed
    </Button>
    <br />
    <br />
    <Button layout={layout} autoFocus size={size} width={width}>
      Focused
    </Button>
    <br />
    <br />
    <Button layout={layout} disabled size={size} width={width}>
      Disabled
    </Button>
    <br />
    <br />
    <Button layout={layout} isLoading size={size} width={width}>
      Loading
    </Button>
    <br />
    <br />
    <Button
      layout={layout}
      svgIcon={icon}
      size={size}
      width={width}
      iconPosition={EIconPosition.ICON_BEFORE}
    >
      icon before text
    </Button>
    <br />
    <br />
    <Button
      layout={layout}
      svgIcon={icon}
      size={size}
      width={width}
      iconPosition={EIconPosition.ICON_AFTER}
    >
      icon after text
    </Button>
    <br />
    <br />
    <Button
      layout={layout}
      svgIcon={icon}
      size={size}
      width={width}
      iconProps={{ alt: "Do something" }}
    />
    <br />
    <br />
    <Button
      layout={layout}
      svgIcon={icon}
      size={size}
      width={width}
      isLoading={true}
      iconProps={{ alt: "Do something" }}
    />
  </>
);

storiesOf("NDS|Atoms/Button", module)
  .add("primary, normal size, normal width", () => (
    <GenerateStory
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.NORMAL}
      width={EButtonWidth.NORMAL}
    />
  ))
  .add("primary, small size, normal width", () => (
    <GenerateStory
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.SMALL}
      width={EButtonWidth.NORMAL}
    />
  ))
  .add("primary, huge size, normal width", () => (
    <GenerateStory
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.HUGE}
      width={EButtonWidth.NORMAL}
    />
  ))
  .add("primary, normal size, block width", () => (
    <GenerateStory
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.SMALL}
      width={EButtonWidth.BLOCK}
    />
  ))
  .add("primary, normal size, no-padding width", () => (
    <GenerateStory
      layout={EButtonLayout.PRIMARY}
      size={EButtonSize.NORMAL}
      width={EButtonWidth.NO_PADDING}
    />
  ));
