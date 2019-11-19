import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TestMessage } from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { GenericModalLayout } from "./GenericModal";

const title = createMessage(TestMessage.TEST_MESSAGE, {
  message: "C'mon, salty pants. you won't loot the quarter-deck.",
});
const description = createMessage(TestMessage.TEST_MESSAGE, {
  message:
    "The plunder stutters urchin like a stormy wench. Wave cowardly like a gutless doubloons. Arrr, wet strength!",
});

storiesOf("GenericModal", module)
  .add("with title", () => (
    <GenericModalLayout
      onClick={action("click")}
      closeModal={action("close")}
      isOpen={true}
      genericModalObj={{
        title,
      }}
    />
  ))
  .add("with title and description", () => (
    <GenericModalLayout
      onClick={action("click")}
      closeModal={action("close")}
      isOpen={true}
      genericModalObj={{
        title,
        description,
      }}
    />
  ))
  .add("with title and check icon", () => (
    <GenericModalLayout
      onClick={action("click")}
      closeModal={action("close")}
      isOpen={true}
      genericModalObj={{
        title,
        icon: "check",
        description,
      }}
    />
  ))
  .add("with title and exclamation icon", () => (
    <GenericModalLayout
      onClick={action("click")}
      closeModal={action("close")}
      isOpen={true}
      genericModalObj={{
        title,
        icon: "exclamation",
        description,
      }}
    />
  ))
  .add("with custom component", () => {
    const CustomComponent = () => (
      <section>
        <h1>Halitosis, fight, and madness</h1>
        <p>
          Freebooter of a heavy-hearted passion, fear the courage! The wave hails with life, burn
          the lighthouse before it stutters. Planks are the clouds of the clear strength.
        </p>
      </section>
    );

    return (
      <GenericModalLayout
        onClick={action("click")}
        closeModal={action("close")}
        isOpen={true}
        component={CustomComponent}
      />
    );
  });
