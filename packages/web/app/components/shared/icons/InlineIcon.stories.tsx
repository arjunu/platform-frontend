import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InlineIcon } from "./InlineIcon";

import * as eth_icon from "../../../assets/img/eth_icon.svg";
import * as euro_icon from "../../../assets/img/euro_icon.svg";
import * as link_arrow from "../../../assets/img/link_arrow.svg";
import * as logo_square_white from "../../../assets/img/logo-square-white.svg";
import * as logo_capitalized from "../../../assets/img/logo_capitalized.svg";
import * as logo_small_black from "../../../assets/img/logo_small_black.svg";
import * as logo_white from "../../../assets/img/logo_white.svg";
import * as logo_yellow from "../../../assets/img/logo_yellow.svg";
import * as mail_link from "../../../assets/img/mail_link.svg";
import * as neu_icon from "../../../assets/img/neu_icon.svg";
import * as nEUR_icon from "../../../assets/img/nEUR_icon.svg";
import * as info from "../../../assets/img/notifications/info.svg";
import * as success from "../../../assets/img/notifications/success.svg";
import * as warning from "../../../assets/img/notifications/warning.svg";
import * as no_computer from "../../../assets/img/seed_backup/no_computer.svg";
import * as safe from "../../../assets/img/seed_backup/safe.svg";
import * as write from "../../../assets/img/seed_backup/write.svg";
import * as token_icon from "../../../assets/img/token_icon.svg";
import * as browser_icon from "../../../assets/img/wallet_selector/browser_icon.svg";
import * as check_metamask from "../../../assets/img/wallet_selector/check_metamask.svg";
import * as enter_password from "../../../assets/img/wallet_selector/enter_password.svg";
import * as ledger_confirm from "../../../assets/img/wallet_selector/ledger_confirm.svg";
import * as ledger_login_step_1 from "../../../assets/img/wallet_selector/ledger_login_step_1.svg";
import * as ledger_login_step_2 from "../../../assets/img/wallet_selector/ledger_login_step_2.svg";
import * as ledger_login_step_3 from "../../../assets/img/wallet_selector/ledger_login_step_3.svg";
import * as ledger_login_step_4 from "../../../assets/img/wallet_selector/ledger_login_step_4.svg";
import * as ledger_login_step_5 from "../../../assets/img/wallet_selector/ledger_login_step_5.svg";
import * as ledger_login_step_6 from "../../../assets/img/wallet_selector/ledger_login_step_6.svg";
import * as lock_icon from "../../../assets/img/wallet_selector/lock_icon.svg";
import * as logo_chrome from "../../../assets/img/wallet_selector/logo_chrome.svg";
import * as logo_firefox from "../../../assets/img/wallet_selector/logo_firefox.svg";
import * as reload from "../../../assets/img/wallet_selector/reload.svg";
import * as wallet_confirm_icon from "../../../assets/img/wallet_selector/wallet_confirm_icon.svg";
import * as wallet_icon from "../../../assets/img/wallet_selector/wallet_icon.svg";

// Load all inline icons
const context = require.context("../../../assets/img/inline_icons/", true, /\.(svg)$/);
const allInlineIcons: ReadonlyArray<string> = context.keys().map<string>(context);

storiesOf("Icons", module)
  .add("InlineIcon", () => (
    <>
      {allInlineIcons.map((svg, i) => (
        <span key={i} style={{ display: "inline-block", height: "2em", width: "3em" }}>
          <InlineIcon svgIcon={svg} />
        </span>
      ))}
    </>
  ))
  .add("other icons", () => (
    <>
      <h3>Notification</h3>
      {[info, success, warning].map(svg => (
        <span style={{ display: "inline-block", height: "2em", width: "3em" }}>
          <img src={svg} alt="" />
        </span>
      ))}
      <br />

      <h3>Seed backup</h3>
      {[no_computer, safe, write].map(svg => (
        <span style={{ display: "inline-block" }} className="m-1">
          <img src={svg} alt="" />
        </span>
      ))}
      <br />

      <h3>Wallet selector</h3>
      {[
        browser_icon,
        ledger_confirm,
        ledger_login_step_1,
        ledger_login_step_2,
        ledger_login_step_3,
        ledger_login_step_4,
        ledger_login_step_5,
        ledger_login_step_6,
        lock_icon,
        logo_chrome,
        logo_firefox,
        wallet_confirm_icon,
        wallet_icon,
        check_metamask,
        enter_password,
        reload,
      ].map(svg => (
        <span style={{ display: "inline-block" }} className="m-1">
          <img src={svg} alt="" />
        </span>
      ))}
      <br />

      <h3>Other icons</h3>
      {[
        eth_icon,
        euro_icon,
        link_arrow,
        logo_capitalized,
        logo_small_black,
        logo_square_white,
        logo_white,
        logo_yellow,
        mail_link,
        neu_icon,
        nEUR_icon,
        token_icon,
      ].map(svg => (
        <span style={{ display: "inline-block" }} className="m-1">
          <img src={svg} alt="" />
        </span>
      ))}
      <br />
    </>
  ));
