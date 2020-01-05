import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Message } from "./Message";

import image from "../../../assets/img/header/social_logo.png";

storiesOf("Modals/Message", module).add("default", () => (
  <Message
    image={<img src={image} width={"100%"} />}
    title={"Message title"}
    text={
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. A atque beatae, dolores inventore libero maiores perspiciatis? Corporis distinctio dolorum explicabo illo vero! At eum quae quas saepe suscipit vero? Fugiat."
    }
    hint={"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Autem, earum."}
  />
));
