import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { DropdownMenuEntry, EMenuEntryType, MenuEntry } from "./MenuEntry";

import logoutIcon from "../../../assets/img/inline_icons/logout.svg";

storiesOf("Menu entries/Dropdown menu", module)
  .add("entry link", () => (
    <>
      <DropdownMenuEntry
        key="test"
        type={EMenuEntryType.LINK}
        to={"test_target"}
        menuName={"test menu"}
      />
      <DropdownMenuEntry
        key="test_active"
        type={EMenuEntryType.LINK}
        to={"test_target"}
        menuName={"test menu active"}
        isActive={() => true}
      />
      <DropdownMenuEntry
        key="test_icon"
        type={EMenuEntryType.LINK}
        to={"test_target"}
        menuName={"test menu with an icon"}
        svgString={logoutIcon}
      />
      <DropdownMenuEntry key={"separator"} type={EMenuEntryType.SEPARATOR} />
      <DropdownMenuEntry
        key="test_disabled"
        type={EMenuEntryType.LINK}
        to={"test_target"}
        menuName={"test menu disabled"}
        svgString={logoutIcon}
        disabled={true}
      />
    </>
  ))
  .add("external entry link", () => (
    <>
      <DropdownMenuEntry
        key="test"
        type={EMenuEntryType.EXTERNAL_LINK}
        to={"test_target"}
        menuName={"test menu external"}
      />
      <DropdownMenuEntry
        key="test_icon"
        type={EMenuEntryType.EXTERNAL_LINK}
        to={"test_target"}
        menuName={"external with icon"}
        svgString={logoutIcon}
      />
      <DropdownMenuEntry
        key="test_disabled"
        type={EMenuEntryType.EXTERNAL_LINK}
        to={"test_target"}
        menuName={"test menu disabled"}
        svgString={logoutIcon}
        disabled={true}
      />
    </>
  ))
  .add("action entry link", () => (
    <>
      <DropdownMenuEntry
        key="test"
        type={EMenuEntryType.ACTION}
        onClick={action("test-action")}
        menuName={"test menu action"}
      />
      <DropdownMenuEntry
        key="test_icon"
        type={EMenuEntryType.ACTION}
        onClick={action("test-action")}
        menuName={"action with icon"}
        svgString={logoutIcon}
      />
      <DropdownMenuEntry
        key="test_disabled"
        type={EMenuEntryType.ACTION}
        onClick={action("test-action")}
        menuName={"action entry disabled"}
        svgString={logoutIcon}
        disabled={true}
      />
    </>
  ));

storiesOf("Menu entries/Normal menu", module)
  .add("entry link", () => (
    <div style={{ display: "grid", gridAutoFlow: "column", width: "100%" }}>
      <MenuEntry key="test" type={EMenuEntryType.LINK} to={"test_target"} menuName={"test menu"} />
      <MenuEntry
        key="test_active"
        type={EMenuEntryType.LINK}
        to={"test_target"}
        menuName={"test menu active"}
        isActive={() => true}
      />
      <MenuEntry
        key="test_icon"
        type={EMenuEntryType.LINK}
        to={"test_target"}
        menuName={"test menu with an icon"}
        svgString={logoutIcon}
      />
      <MenuEntry key="separator" type={EMenuEntryType.SEPARATOR} />
      <MenuEntry
        key="test_disabled"
        type={EMenuEntryType.LINK}
        to={"test_target"}
        menuName={"test menu disabled"}
        svgString={logoutIcon}
        disabled={true}
      />
    </div>
  ))
  .add("external entry link", () => (
    <div style={{ display: "grid", gridAutoFlow: "column", width: "100%" }}>
      <MenuEntry
        key="test"
        type={EMenuEntryType.EXTERNAL_LINK}
        to={"test_target"}
        menuName={"test menu external"}
      />
      <MenuEntry
        key="test_icon"
        type={EMenuEntryType.EXTERNAL_LINK}
        to={"test_target"}
        menuName={"external with icon"}
        svgString={logoutIcon}
      />
      <MenuEntry key="separator" type={EMenuEntryType.SEPARATOR} />
      <MenuEntry
        key="test_disabled"
        type={EMenuEntryType.EXTERNAL_LINK}
        to={"test_target"}
        menuName={"test menu disabled"}
        svgString={logoutIcon}
        disabled={true}
      />
    </div>
  ))
  .add("action entry link", () => (
    <div style={{ display: "grid", gridAutoFlow: "column", width: "100%" }}>
      <MenuEntry
        key="test"
        type={EMenuEntryType.ACTION}
        onClick={action("test-action")}
        menuName={"test menu action"}
      />
      <MenuEntry
        key="test_icon"
        type={EMenuEntryType.ACTION}
        onClick={action("test-action")}
        menuName={"action with icon"}
        svgString={logoutIcon}
      />
      <MenuEntry key="separator" type={EMenuEntryType.SEPARATOR} />
      <MenuEntry
        key="test_disabled"
        type={EMenuEntryType.ACTION}
        onClick={action("test-action")}
        menuName={"action entry disabled"}
        svgString={logoutIcon}
        disabled={true}
      />
    </div>
  ));
