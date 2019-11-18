import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Button, ButtonArrowLeft, ButtonArrowRight, EIconPosition } from "./Button";
import { EButtonLayout, EButtonSize } from "./ButtonBase";

import * as icon from "../../../assets/img/inline_icons/download.svg";

type TGenerateStoryProps = {
  layout: EButtonLayout;
};

const GenerateStory: React.FunctionComponent<TGenerateStoryProps> = ({ layout }) => (
  <>
    <Button layout={layout} svgIcon={icon} iconPosition={EIconPosition.ICON_BEFORE}>
      icon before text
    </Button>
    <br />
    <br />
    <Button layout={layout} svgIcon={icon} iconPosition={EIconPosition.ICON_AFTER}>
      icon after text
    </Button>
    <br />
    <br />
    <Button
      layout={layout}
      svgIcon={icon}
      size={EButtonSize.SMALL}
      iconPosition={EIconPosition.ICON_BEFORE}
    >
      icon before small
    </Button>
    <br />
    <br />
    <Button
      layout={layout}
      svgIcon={icon}
      size={EButtonSize.HUGE}
      iconPosition={EIconPosition.ICON_BEFORE}
    >
      huge before small
    </Button>
  </>
);

storiesOf("NDS|Atoms/Button", module)
  .add("primary", () => <GenerateStory layout={EButtonLayout.PRIMARY} />)
  .add("outline", () => <GenerateStory layout={EButtonLayout.OUTLINE} />)
  .add("secondary", () => <GenerateStory layout={EButtonLayout.SECONDARY} />)
  .add("ghost", () => <GenerateStory layout={EButtonLayout.GHOST} />);

storiesOf("buttons/ArrowRight", module).add("primary", () => (
  <ButtonArrowRight>primary</ButtonArrowRight>
));

storiesOf("buttons/ArrowLeft", module).add("primary", () => (
  <ButtonArrowLeft>primary</ButtonArrowLeft>
));
