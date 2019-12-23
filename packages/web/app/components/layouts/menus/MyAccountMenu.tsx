import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { compose, withProps } from "recompose";

import { actions } from "../../../modules/actions";
import { userHasKycAndEmailVerified } from "../../../modules/eto-flow/selectors";
import { selectIsActionRequiredSettings } from "../../../modules/notifications/selectors";
import { appConnect } from "../../../store";
import { IdentityModal } from "../../identity/IdentityModal";
import { MenuBase } from "./MenuBase";
import { accountMenuData } from "./MenuData";
import { DropdownMenuEntry, TMenuEntry } from "./MenuEntry";

import userProfile from "../../../assets/img/user-profile.svg";
import * as styles from "./MyAccountMenu.module.scss";

interface IProps {
  actionRequired: boolean;
  logout: () => void;
}

interface IStateProps {
  actionRequired: boolean;
}

interface IMenuData {
  data: TMenuEntry[];
}

const ClosedElement: React.FunctionComponent = () => (
  <>
    <img src={userProfile} alt="menu" data-test-id="account-menu-open-button" />
    <span className={styles.name}>
      <FormattedMessage id="menu.wallet.my-account" />
    </span>
  </>
);

export const Menu: React.FunctionComponent<IMenuData> = ({ data }) => (
  <div className={styles.menu}>
    <div className={styles.arrow} />
    <div className={styles.menuInner}>
      {data.map(entry => (
        <DropdownMenuEntry {...entry} />
      ))}
    </div>
  </div>
);

export const MyAccountMenuLayout: React.FunctionComponent<IMenuData> = props => (
  <MenuBase
    className={styles.myAccountButton}
    closedElement={<ClosedElement />}
    renderMenu={<Menu data={props.data} />}
  />
);

export const MyAccountMenu = compose<IMenuData, {}>(
  appConnect<IStateProps>({
    stateToProps: state => ({
      actionRequired: selectIsActionRequiredSettings(state),
      userHasKycAndVerifiedEmail: userHasKycAndEmailVerified(state),
    }),
    dispatchToProps: dispatch => ({
      openIdentityModal: () => dispatch(actions.genericModal.showModal(IdentityModal)),
      logout: () => {
        dispatch(actions.auth.logout());
      },
    }),
  }),
  withProps<IMenuData, IProps>(props => ({
    data: accountMenuData(props.actionRequired, props.logout),
  })),
)(MyAccountMenuLayout);
