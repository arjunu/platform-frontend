import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DocumentButton, DocumentLabel, DocumentLink } from "./DocumentLink";
import { InlineIcon } from "./icons";

import * as link_out from "../../assets/img/inline_icons/link_out.svg";
import * as link from "../../assets/img/inline_icons/social_link.svg";

storiesOf("Document/DocumentLink", module)
  .add("doc", () => <DocumentLink url="doc" name="foo" />)
  .add("pdf", () => <DocumentLink url="pdf" name="bar" />)
  .add("alt", () => (
    <DocumentLink url="pdf" name="bar" altIcon={<InlineIcon svgIcon={link_out} />} />
  ));

storiesOf("Document/DocumentButton", module)
  .add("default", () => <DocumentButton title="my document template" onClick={action("onClick")} />)
  .add("custom icon", () => (
    <DocumentButton
      title="my custom template"
      onClick={action("onClick")}
      altIcon={<InlineIcon svgIcon={link} />}
    />
  ));

storiesOf("Document/DocumentLabel", module)
  .add("default", () => <DocumentLabel title="my document template" />)
  .add("custom icon", () => (
    <DocumentLabel title="my custom template" altIcon={<InlineIcon svgIcon={link} />} />
  ));
