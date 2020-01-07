import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Button } from "../buttons";
import { ECustomTooltipTextPosition, TooltipBase } from "./TooltipBase";

import icon from "../../../assets/img/logo_yellow.svg";

storiesOf("Basic UI/TooltipBase", module)
  .add("default", () => (
    <div style={{ margin: "0 10em 10em" }}>
      <img id="tooltip-target1" src={icon} alt="" />
      <TooltipBase isOpen={true} target="tooltip-target1">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <Button type="submit">Lorem</Button>
      </TooltipBase>
    </div>
  ))
  .add("placement right", () => (
    <div style={{ margin: "10em" }}>
      <img id="tooltip-target2" src={icon} alt="" />
      <TooltipBase isOpen={true} target="tooltip-target2" placement="right">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </TooltipBase>
    </div>
  ))
  .add("placement left", () => (
    <div style={{ margin: "10em" }}>
      <img id="tooltip-target3" src={icon} style={{ marginLeft: "20em" }} alt="" />
      <TooltipBase isOpen={true} target="tooltip-target3" placement="left">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </TooltipBase>
    </div>
  ))
  .add("placement top", () => (
    <div style={{ margin: "10em" }}>
      <img id="tooltip-target4" src={icon} alt="" />
      <TooltipBase isOpen={true} target="tooltip-target4" placement="top">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </TooltipBase>
    </div>
  ))
  .add("text left", () => (
    <div style={{ margin: "0 10em 10em" }}>
      <img id="tooltip-target4" src={icon} alt="" />
      <TooltipBase
        isOpen={true}
        target="tooltip-target4"
        textPosition={ECustomTooltipTextPosition.LEFT}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </TooltipBase>
    </div>
  ));
