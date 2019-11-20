import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { BankTransferRedeemLayout } from "./BankTransferRedeemInit";

storiesOf("BankTransferRedeem/Init", module)
  .addDecorator(withModalBody())
  .addDecorator(story => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {story}
    </Formik>
  ))
  .add("default", () => (
    <BankTransferRedeemLayout
      minAmount={Q18.mul("5").toString()}
      neuroAmount={Q18.mul("1305.89").toString()}
      neuroEuroAmount={Q18.mul("1305.89").toString()}
      bankFee={Q18.mul("0.005").toString()}
      confirm={action("CONFIRM")}
      verifyBankAccount={action("LINK_ACCOUNT")}
    />
  ));
