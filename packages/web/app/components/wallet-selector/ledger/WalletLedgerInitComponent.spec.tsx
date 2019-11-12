import { expect } from "chai";
import { shallow } from "enzyme";
import noop from "lodash/noop";
import * as React from "react";

import { tid } from "../../../../test/testUtils";
import { getMessageTranslation, LedgerErrorMessage } from "../../translatedMessages/messages";
import { createMessage } from "../../translatedMessages/utils";
import { WalletLedgerInitComponent } from "./WalletLedgerInitComponent";

describe("<WalletLedgerInitComponent />", () => {
  it("should render error message", () => {
    const errorMsg = createMessage(LedgerErrorMessage.GENERIC_ERROR);
    const expectedResult = getMessageTranslation(errorMsg);
    const component = shallow(
      <WalletLedgerInitComponent
        errorMessage={errorMsg}
        isInitialConnectionInProgress={false}
        tryToEstablishConnectionWithLedger={noop}
      />,
    );

    expect(
      component
        .find(tid("ledger-wallet-error-msg"))
        .children()
        .get(0),
    ).to.be.deep.eq(expectedResult);
  });
});
