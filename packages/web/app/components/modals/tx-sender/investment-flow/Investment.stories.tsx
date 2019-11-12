import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { testEto } from "../../../../../test/fixtures";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContractTypeChecked,
} from "../../../../modules/eto/types";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { injectIntlHelpers } from "../../../../utils/injectIntlHelpers.unsafe";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { InvestmentSelectionComponent } from "./Investment";
import { wallets } from "./InvestmentTypeSelector.stories";
import { EInvestmentCurrency } from "./utils";

const Investment = injectIntlHelpers(InvestmentSelectionComponent);

const testEtoInWhitelist = {
  ...testEto,
  contract: {
    ...testEto.contract!,
    timedState: EETOStateOnChain.Whitelist,
  },
} as TEtoWithCompanyAndContractTypeChecked;

storiesOf("Investment/Form", module)
  .addDecorator(withModalBody())
  .addDecorator(story => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {story}
    </Formik>
  ))
  .add("default with error", () => (
    <Investment
      wallets={wallets}
      changeEthValue={action("changeEthValue")}
      changeEuroValue={action("changeEuroValue")}
      changeInvestmentType={action("changeInvestmentType")}
      equityTokenCount={"1234"}
      errorState={EInvestmentErrorState.ExceedsWalletBalance}
      ethValue={"1234123412341232341234"}
      eto={testEtoInWhitelist}
      euroValue={"123412341234123412341234"}
      gasCostEth={"123412323412341234"}
      gasCostEuro={"12341234123412341234"}
      etherPriceEur={"123412341234123412341234"}
      eurPriceEther={"0.123412341234123412341234"}
      investEntireBalance={action("investEntireBalance")}
      investmentType={EInvestmentType.Eth}
      investmentCurrency={EInvestmentCurrency.ETH}
      minTicketEth={"12341234123412341234"}
      minTicketEur={"1234"}
      maxTicketEur={"123456"}
      readyToInvest={false}
      showTokens={true}
      sendTransaction={action("sendTransaction")}
      hasPreviouslyInvested={true}
      startUpgradeFlow={action("startUpgradeFlow")}
      etoTokenGeneralDiscounts={{
        whitelistDiscountFrac: 0.35,
        whitelistDiscountUlps: "296633323000000000",
        publicDiscountFrac: 0.25,
        publicDiscountUlps: "339009512000000000",
      }}
      etoTokenPersonalDiscount={{
        whitelistDiscountAmountLeft: "-1.043240344598e+23",
        whitelistDiscountUlps: "0",
        whitelistDiscountFrac: 0.5,
      }}
      etoTokenStandardPrice={0.6}
    />
  ));
