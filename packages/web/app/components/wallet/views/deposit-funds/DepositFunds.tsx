import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../../modules/actions";
import { appConnect } from "../../../../store";
import { injectIntlHelpers } from "@neufund/shared"
import { BreadCrumb } from "../../../shared/BreadCrumb";
import { Button } from "../../../shared/buttons";
import { Panel } from "../../../shared/Panel";
import { TabContent, Tabs } from "../../../shared/Tabs";
import { walletRoutes } from "../../routes";

import * as styles from "./DepositFunds.module.scss";

const DoneButton = compose<React.FunctionComponent>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      onClick: () => dispatch(actions.routing.goToWallet()),
    }),
  }),
)(Button);

interface IProps {
  path: string;
}

export const DepositFunds = injectIntlHelpers<IProps>(
  ({ children, intl: { formatIntlMessage } }) => (
    <>
      <Row>
        <Col>
          <BreadCrumb
            path={[formatIntlMessage("dashboard.name"), formatIntlMessage("wallet.name")]}
            view={formatIntlMessage("wallet.deposit-funds.name")}
            className="pt-5 pb-5"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={{ size: 10, offset: 1 }}>
          <Panel>
            <div className={styles.panelContent}>
              <Tabs>
                <TabContent
                  tab={formatIntlMessage("wallet.deposit-funds.menu.eur")}
                  routerPath={walletRoutes.euroToken}
                />
                <TabContent
                  tab={formatIntlMessage("wallet.deposit-funds.menu.eth")}
                  routerPath={walletRoutes.eth}
                />
              </Tabs>
              {children}
              <DoneButton>
                <FormattedMessage id="form.button.done" />
              </DoneButton>
            </div>
          </Panel>
        </Col>
      </Row>
    </>
  ),
);
