import BigNumber from "bignumber.js";
import { expect } from "chai";
import { render, shallow } from "enzyme";
import * as React from "react";
import { spy } from "sinon";

import { wrapWithIntl } from "../../../../test/integrationTestUtils.unsafe";
import { tid } from "../../../../test/testUtils";
import { Q18 } from "../../../config/constants";
import { AccountRow, WalletLedgerChooserTableSimple } from "./WalletLedgerChooserTableSimple";

const weiBalance = new BigNumber("1.6495").mul(Q18).toString();
const neuWeiBalance = new BigNumber("10.6495").mul(Q18).toString();

const defaultProps = () => ({
  accounts: [
    {
      address: "0x6C1086C292a7E1FdF66C68776eA972038467A370",
      derivationPath: "44'/60'/0'/0",
      balanceETH: weiBalance,
      balanceNEU: neuWeiBalance,
    },
    {
      address: "0xB2A0e2688c5A82bEEe6818F5a3D206680FdFD75d",
      derivationPath: "44'/60'/0'/1",
      balanceETH: "0",
      balanceNEU: "0",
    },
    {
      address: "0xa13D14DA39529761a6C45F4f556700735E0774a8",
      derivationPath: "44'/60'/0'/2",
      balanceETH: "0",
      balanceNEU: "0",
    },
    {
      address: "0x3cC2ef578f6Eb7ff63f9CA8f5a54cfe40339256A",
      derivationPath: "44'/60'/0'/3",
      balanceETH: "1.6495",
      balanceNEU: "0",
    },
  ],
  handleAddressChosen: spy(),
});

describe("<WalletLedgerChooserTableSimple />", () => {
  it("should render all provided accounts", () => {
    const props = defaultProps();
    const component = shallow(<WalletLedgerChooserTableSimple {...props} />);
    expect(component.find(AccountRow)).to.be.length(props.accounts.length);
    component.find(AccountRow).forEach((row, index) => {
      expect(
        row.equals(
          <AccountRow
            ledgerAccount={props.accounts[index]}
            handleAddressChosen={props.handleAddressChosen}
          />,
        ),
      ).to.be.true;
    });
  });

  describe("<AccountRow />", () => {
    it("should render correct account data and handle click", () => {
      const props = defaultProps();
      const account = props.accounts[0];
      const accountRow = render(
        wrapWithIntl(
          <AccountRow ledgerAccount={account} handleAddressChosen={props.handleAddressChosen} />,
        ),
      );
      const ethBalance = new BigNumber(weiBalance).div(Q18).toString();
      const neuBalance = new BigNumber(neuWeiBalance).div(Q18).toString();

      const renderedAddress = accountRow.find(tid("account-address"));
      expect(renderedAddress.text()).to.be.eq(account.address);
      const renderedBalanceETH = accountRow.find(tid("account-balance-eth"));
      expect(renderedBalanceETH.text()).to.be.eq(`${ethBalance} ETH`);
      const renderedBalanceNEU = accountRow.find(tid("account-balance-neu"));
      expect(renderedBalanceNEU.text()).to.be.eq(`${neuBalance} NEU`);
    });

    it("should handle click", () => {
      const props = defaultProps();
      const account = props.accounts[0];
      const accountRow = shallow(
        <AccountRow ledgerAccount={account} handleAddressChosen={props.handleAddressChosen} />,
      );

      accountRow.find(tid("button-select")).simulate("click");
      expect(props.handleAddressChosen).to.be.calledOnce;
    });
  });
});
