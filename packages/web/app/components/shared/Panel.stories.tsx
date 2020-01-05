import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ButtonInline } from "./buttons";
import { Panel } from "./Panel";

import icon from "../../assets/img/notifications/warning.svg";

const lorem =
  "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, eveniet reiciendis minus aperiam numquam vero at placeat, officia, porro similique voluptatem dolores provident labore dolorem temporibus veniam sapiente nihil quibusdam.";

storiesOf("Basic UI/Panel", module)
  .add("default", () => <Panel>{lorem}</Panel>)
  .add("narrow", () => <Panel narrow={true}>{lorem}</Panel>)
  .add("with header text", () => <Panel headerText="Sample header text">{lorem}</Panel>)
  .add("with header text and icon", () => (
    <Panel headerText="Sample header text" icon={icon}>
      {lorem}
    </Panel>
  ))
  .add("with header text and right component", () => (
    <Panel
      headerText="Sample header text"
      rightComponent={<ButtonInline onClick={action("onClick")}>Go to Wallet</ButtonInline>}
    >
      {lorem}
    </Panel>
  ));
