import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ButtonBase, EButtonLayout, EButtonSize, EButtonWidth } from "./ButtonBase";

type TGenerateStoryProps = {
  layout: EButtonLayout;
  size: EButtonSize;
  width: EButtonWidth;
};

const GenerateStory: React.FunctionComponent<TGenerateStoryProps> = ({ layout, size, width }) => (
  <>
    <ButtonBase layout={layout} size={size} width={width}>
      Normal
    </ButtonBase>
    <br />
    <br />
    <ButtonBase layout={layout} isActive={true} size={size} width={width}>
      Pressed
    </ButtonBase>
    <br />
    <br />
    <ButtonBase layout={layout} autoFocus size={size} width={width}>
      Focused
    </ButtonBase>
    <br />
    <br />
    <ButtonBase layout={layout} disabled size={size} width={width}>
      Disabled
    </ButtonBase>
    <br />
    <br />
    <ButtonBase layout={layout} isLoading size={size} width={width} />
  </>
);

storiesOf("NDS|Atoms/ButtonBase", module)
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
  ))
  // TODO: Migrate all stories to use `GenerateStory`
  .add("outline", () => (
    <>
      <ButtonBase
        layout={EButtonLayout.OUTLINE}
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Normal
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.OUTLINE}
        isActive={true}
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Pressed
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.OUTLINE}
        autoFocus
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Focused
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.OUTLINE}
        disabled
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Disabled
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.OUTLINE}
        isLoading
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      />
    </>
  ))
  .add("secondary", () => (
    <>
      <ButtonBase
        layout={EButtonLayout.SECONDARY}
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Normal
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.SECONDARY}
        isActive={true}
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Pressed
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.SECONDARY}
        autoFocus
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Focused
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.SECONDARY}
        disabled
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Disabled
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.SECONDARY}
        isLoading
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      />
    </>
  ))
  .add("ghost", () => (
    <>
      <ButtonBase
        layout={EButtonLayout.GHOST}
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Normal
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.GHOST}
        isActive={true}
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Pressed
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.GHOST}
        autoFocus
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Focused
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.GHOST}
        disabled
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      >
        Disabled
      </ButtonBase>
      <br />
      <br />
      <ButtonBase
        layout={EButtonLayout.GHOST}
        isLoading
        size={EButtonSize.NORMAL}
        width={EButtonWidth.NORMAL}
      />
    </>
  ));
