import { invariant } from "@neufund/shared"
import * as cn from "classnames";
import * as React from "react";
import { match, NavLink } from "react-router-dom";

import { TDataTestId, TTranslatedString } from "../../../types";
import { ButtonBase } from "../../shared/buttons/ButtonBase";
import { InlineIcon } from "../../shared/icons/InlineIcon";
import { ExternalLink } from "../../shared/links/index";

import * as styles from "./MenuEntry.module.scss";

export enum EMenuEntryType {
  LINK = "link",
  EXTERNAL_LINK = "externalLink",
  ACTION = "action",
  SEPARATOR = "separator",
}

export enum EMenuEntryRenderingType {
  MENU = "menu",
  DROPDOWN_MENU = "dropdownMenu",
}

interface IMenuEntryContent {
  svgString?: string;
  menuName: TTranslatedString;
  disabled?: boolean;
}

interface IMenuInternal {
  menuRenderingType: EMenuEntryRenderingType;
  disabled?: boolean;
}

interface IMenuEntryCommon {
  key: string;
}

interface IMenuEntryDisabled {
  svgString?: string;
  menuName: TTranslatedString;
}

interface IMenuLink {
  actionRequired?: boolean;
  isActive?: (match: match<unknown>) => boolean;
  to: string;
}

interface IMenuAction {
  onClick: () => void;
}

type TMenuEntryExternalLink = { type: EMenuEntryType.EXTERNAL_LINK } & IMenuLink &
  IMenuEntryCommon &
  IMenuEntryContent &
  TDataTestId;

type TMenuEntryLink = { type: EMenuEntryType.LINK } & IMenuLink &
  IMenuEntryCommon &
  IMenuEntryContent &
  TDataTestId;

type TMenuEntryButton = { type: EMenuEntryType.ACTION } & IMenuAction &
  IMenuEntryCommon &
  IMenuEntryContent &
  TDataTestId;

type TMenuEntrySeparator = { type: EMenuEntryType.SEPARATOR } & IMenuEntryCommon;

export type TMenuEntry =
  | TMenuEntrySeparator
  | TMenuEntryExternalLink
  | TMenuEntryLink
  | TMenuEntryButton;

export const MenuEntryContent: React.FunctionComponent<IMenuEntryContent & IMenuInternal> = ({
  menuName,
  svgString,
  disabled,
}) => (
  <>
    <div className={cn(styles.name, { [styles.disabledItemContent]: disabled })}>{menuName}</div>
    {svgString && (
      <InlineIcon
        svgIcon={svgString}
        alt=""
        className={cn(styles.icon, { [styles.disabledItemContent]: disabled })}
      />
    )}
  </>
);

export const MenuEntrySeparator: React.FunctionComponent<IMenuInternal> = ({
  menuRenderingType,
}) => (
  <div
    className={
      menuRenderingType === EMenuEntryRenderingType.MENU
        ? styles.separator
        : styles.dropdownSeparator
    }
  />
);

export const MenuEntryDisabled: React.FunctionComponent<IMenuEntryDisabled &
  IMenuInternal &
  TDataTestId> = ({ svgString, menuName, menuRenderingType, ["data-test-id"]: dataTestId }) => (
  <div
    className={
      menuRenderingType === EMenuEntryRenderingType.MENU
        ? cn(styles.menuItem, styles.menuItemDisabled)
        : cn(styles.dropdownMenuItem, styles.dropdownMenuItemDisabled)
    }
    data-test-id={dataTestId}
  >
    <MenuEntryContent
      menuRenderingType={menuRenderingType}
      menuName={menuName}
      svgString={svgString}
      disabled={true}
    />
  </div>
);

const MenuEntryAction: React.FunctionComponent<IMenuAction &
  IMenuEntryContent &
  IMenuInternal &
  TDataTestId> = ({ onClick, menuRenderingType, ["data-test-id"]: dataTestId, ...props }) => (
  <ButtonBase
    className={
      menuRenderingType === EMenuEntryRenderingType.MENU ? styles.menuItem : styles.dropdownMenuItem
    }
    onClick={onClick}
    data-test-id={dataTestId}
  >
    <MenuEntryContent {...props} menuRenderingType={menuRenderingType} />
  </ButtonBase>
);

const MenuEntryLink: React.FunctionComponent<IMenuEntryContent &
  IMenuLink &
  IMenuInternal &
  TDataTestId> = ({ to, menuRenderingType, isActive, ["data-test-id"]: dataTestId, ...props }) => (
  <NavLink
    to={to}
    data-test-id={dataTestId}
    className={
      menuRenderingType === EMenuEntryRenderingType.MENU ? styles.menuItem : styles.dropdownMenuItem
    }
    isActive={isActive}
    activeClassName={
      menuRenderingType === EMenuEntryRenderingType.MENU
        ? styles.menuItemActive
        : styles.dropdownMenuItemActive
    }
  >
    <MenuEntryContent {...props} menuRenderingType={menuRenderingType} />
  </NavLink>
);

const MenuEntryExternalLink: React.FunctionComponent<IMenuEntryContent &
  IMenuLink &
  IMenuInternal &
  TDataTestId> = ({ to, menuRenderingType, isActive, ["data-test-id"]: dataTestId, ...props }) => (
  <ExternalLink
    href={to}
    className={
      menuRenderingType === EMenuEntryRenderingType.MENU ? styles.menuItem : styles.dropdownMenuItem
    }
    data-test-id={dataTestId}
  >
    <MenuEntryContent {...props} menuRenderingType={menuRenderingType} />
  </ExternalLink>
);

const MenuEntryInternal: React.FunctionComponent<TMenuEntry & IMenuInternal> = ({
  type,
  disabled,
  ...rest
}) => {
  if (disabled) {
    return <MenuEntryDisabled {...(rest as IMenuEntryDisabled & IMenuInternal)} />;
  } else {
    switch (type) {
      case EMenuEntryType.SEPARATOR:
        return <MenuEntrySeparator {...(rest as IMenuInternal)} />;
      case EMenuEntryType.ACTION:
        return <MenuEntryAction {...(rest as IMenuEntryContent & IMenuAction & IMenuInternal)} />;
      case EMenuEntryType.LINK:
        return <MenuEntryLink {...(rest as IMenuEntryContent & IMenuLink & IMenuInternal)} />;
      case EMenuEntryType.EXTERNAL_LINK:
        return (
          <MenuEntryExternalLink {...(rest as IMenuEntryContent & IMenuLink & IMenuInternal)} />
        );
      default:
        return invariant(false, "unknown menu entry type");
    }
  }
};

export const DropdownMenuEntry: React.FunctionComponent<TMenuEntry> = props => (
  <MenuEntryInternal {...props} menuRenderingType={EMenuEntryRenderingType.DROPDOWN_MENU} />
);

export const MenuEntry: React.FunctionComponent<TMenuEntry> = props => (
  <MenuEntryInternal {...props} menuRenderingType={EMenuEntryRenderingType.MENU} />
);
