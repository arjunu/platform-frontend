import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { Q18 } from "../../../../config/constants";
import { withStore } from "../../../../utils/storeDecorator.unsafe";
import { withModalBody } from "../../../../utils/storybookHelpers.unsafe";
import { BankTransferRedeemLayout } from "./BankTransferRedeemInit";

storiesOf("BankTransferRedeem/Init", module)
  .addDecorator(withModalBody())
  .addDecorator(
    withStore({
      kyc: {
        claims: {
          isVerified: true,
          isSophisticatedInvestor: true,
          hasBankAccount: true,
          isAccountFrozen: false,
        },
        bankAccount: {
          hasBankAccount: true,
          details: {
            bankAccountNumberLast4: "1234",
            bankName: "Sparkasse Berlin",
            isSepa: true,
            name: "Account Holder Name",
            swiftCode: "BELADEBEXXX",
          },
        },
      },
    }),
  )
  .add("default", () => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <BankTransferRedeemLayout
        minAmount={Q18.mul("5").toString()}
        neuroAmount={Q18.mul("1305.89").toString()}
        neuroEuroAmount={Q18.mul("1305.89").toString()}
        bankFee={Q18.mul("0.005").toString()}
        confirm={action("CONFIRM")}
        verifyBankAccount={action("LINK_ACCOUNT")}
        calculateData={action("CALCULATE_DATA")}
        calculatedData={{
          amount: "0",
          amountUlps: "0",
          bankFee: "0",
          totalRedeemed: "0",
        }}
      />
    </Formik>
  ))
  .add("with data", () => (
    <Formik initialValues={{ amount: "10.50" }} isInitialValid={true} onSubmit={() => {}}>
      <BankTransferRedeemLayout
        minAmount={Q18.mul("5").toString()}
        neuroAmount={Q18.mul("1305.89").toString()}
        neuroEuroAmount={Q18.mul("1305.89").toString()}
        bankFee={Q18.mul("0.005").toString()}
        confirm={action("CONFIRM")}
        verifyBankAccount={action("LINK_ACCOUNT")}
        calculateData={action("CALCULATE_DATA")}
        calculatedData={{
          amount: "100.50",
          amountUlps: Q18.mul("100.5").toString(),
          bankFee: "0.25",
          totalRedeemed: "100.25",
        }}
      />
    </Formik>
  ));
