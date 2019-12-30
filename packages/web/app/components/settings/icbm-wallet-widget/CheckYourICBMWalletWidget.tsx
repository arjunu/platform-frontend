import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import * as Web3Utils from "web3-utils";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { EColumnSpan } from "../../layouts/Container";
import { Button, EButtonLayout, EIconPosition } from "../../shared/buttons";
import { Form, FormFieldColorful } from "../../shared/forms";
import { Panel } from "../../shared/Panel";
import { ECustomTooltipTextPosition, Tooltip } from "../../shared/tooltips";

import arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as styles from "./CheckYourICBMWalletWidget.module.scss";

interface IDispatchProps {
  loadICBMWallet: (address: string) => void;
}

interface IExternalProps {
  columnSpan?: EColumnSpan;
}

type TFormValues = { address: string };

export const CheckYourICBMWalletWidgetComponent: React.FunctionComponent<IExternalProps &
  IDispatchProps> = ({ loadICBMWallet, columnSpan }) => (
  <Panel
    headerText={
      <>
        <FormattedMessage id="check-your-icbm-wallet-widget.header" />
        <Tooltip
          content={<FormattedMessage id="icbm-wallet.tooltip" />}
          textPosition={ECustomTooltipTextPosition.LEFT}
        />
      </>
    }
    columnSpan={columnSpan}
    data-test-id="models.profile.icbm-wallet-widget.check-your-icbm-wallet-widget"
  >
    <Form<TFormValues>
      initialValues={{ address: "" }}
      onSubmit={values => loadICBMWallet(values.address)}
      className={styles.section}
    >
      {({ values }) => (
        <>
          <p>
            <FormattedMessage id="check-your-icbm-wallet-widget.notice" />
          </p>

          <FormFieldColorful
            name="address"
            placeholder="0xff2bee8169957caa2f5a34af7bf8e717fea7f"
            data-test-id="models.profile.icbm-wallet-widget.check-your-icbm-wallet-widget.address"
          />
          {/* TODO: Move validation to yup schema */}
          <Button
            layout={EButtonLayout.GHOST}
            iconPosition={EIconPosition.ICON_AFTER}
            svgIcon={arrowRight}
            type="submit"
            disabled={!Web3Utils.isAddress(values.address.toUpperCase())}
          >
            <FormattedMessage id="check-your-icbm-wallet-widget.submit" />
          </Button>
        </>
      )}
    </Form>
  </Panel>
);

export const CheckYourICBMWalletWidget = appConnect<IDispatchProps>({
  dispatchToProps: dispatch => ({
    loadICBMWallet: (address: string) => {
      dispatch(actions.icbmWalletBalanceModal.getWalletData(address));
    },
  }),
})(CheckYourICBMWalletWidgetComponent);
