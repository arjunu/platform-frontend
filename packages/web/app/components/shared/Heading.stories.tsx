import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EHeadingSize, Heading } from "./Heading";

import neuIcon from "../../assets/img/neu_icon.svg";

storiesOf("Atoms/Heading", module)
  .add("layout: has decorator", () => <Heading level={3}>Lorem Ipsum</Heading>)
  .add("layout: has decorator and description", () => (
    <Heading level={3} description={"No causae vocibus dissentiet pro, id sed diceret blandit."}>
      Lorem Ipsum
    </Heading>
  ))
  .add("layout: has icon", () => (
    <Heading level={3} decorator={neuIcon}>
      Lorem Ipsum
    </Heading>
  ))
  .add("layout: without decorator", () => (
    <Heading level={3} decorator={false}>
      Lorem Ipsum
    </Heading>
  ))
  .add("layout: without decorator and with description", () => (
    <Heading
      level={3}
      decorator={false}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </Heading>
  ))
  .add("size small, without decorator and with description", () => (
    <Heading
      level={3}
      size={EHeadingSize.SMALL}
      decorator={false}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </Heading>
  ))
  .add("size small, with decorator and description", () => (
    <Heading
      level={3}
      size={EHeadingSize.SMALL}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </Heading>
  ))
  .add("size small and with icon", () => (
    <Heading level={3} size={EHeadingSize.SMALL} decorator={neuIcon}>
      Lorem Ipsum
    </Heading>
  ))
  .add("size huge, without decorator and with description", () => (
    <Heading
      level={3}
      size={EHeadingSize.HUGE}
      decorator={false}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </Heading>
  ))
  .add("size huge, with decorator and description", () => (
    <Heading
      level={3}
      size={EHeadingSize.HUGE}
      description={"No causae vocibus dissentiet pro, id sed diceret blandit."}
    >
      Lorem Ipsum
    </Heading>
  ))
  .add("size huge and with icon", () => (
    <Heading level={3} size={EHeadingSize.HUGE} decorator={neuIcon}>
      Lorem Ipsum
    </Heading>
  ))
  .add("with all possible levels", () => (
    <>
      <Heading level={1}>Level 1</Heading>
      <br />
      <Heading level={2}>Level 2</Heading>
      <br />
      <Heading level={3}>Level 3</Heading>
      <br />
      <Heading level={4}>Level 4</Heading>
      <br />
      <Heading level={5}>Level 5</Heading>
      <br />
      <Heading level={6}>Level 6</Heading>
    </>
  ));
