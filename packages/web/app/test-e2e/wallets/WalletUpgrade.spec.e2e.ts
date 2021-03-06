import { extractNumber } from "../../utils/StringUtils";
import { closeModal, confirmAccessModal } from "../utils";
import { goToWallet } from "../utils/navigation";
import { tid } from "../utils/selectors";
import { loginFixtureAccount } from "../utils/userHelpers";

describe("Upgrade icbm wallet", () => {
  it("do euro upgrade", () => {
    loginFixtureAccount("INV_EUR_ICBM_HAS_KYC_2");
    let icbmBalance: number;

    goToWallet();

    cy.get(tid("icbm-wallet.neur.balance-values.large-value")).should($e => {
      icbmBalance = parseFloat(extractNumber($e.text()));
      expect(icbmBalance).to.be.greaterThan(0);
    });
    cy.get(tid("wallet.icbm-euro.upgrade-button")).click();
    cy.get(tid("modals.tx-sender.upgrade-flow.summery.upgradeSummary.accept")).click();
    confirmAccessModal();
    cy.get(tid("modals.shared.signing-message.modal"));
    cy.get(tid("modals.shared.tx-success.modal"));
    closeModal();
    cy.get(tid("locked-wallet.eur.balance-values.large-value")).should($e => {
      const val = parseFloat(extractNumber($e.text()));
      expect(val).to.be.greaterThan(0);
      expect(val).to.equal(icbmBalance);
    });
    cy.get(tid("wallet-start-container")).should($e => {
      expect($e.find(tid("icbm-wallet.neur.balance-values.large-value")).length).to.equal(0);
    });
  });

  it("do eth upgrade", () => {
    loginFixtureAccount("INV_ETH_ICBM_NO_KYC_2");
    let icbmBalance: number;

    goToWallet();

    cy.get(tid("icbm-wallet.eth.balance-values.large-value")).should($e => {
      icbmBalance = parseFloat(extractNumber($e.text()));
      expect(icbmBalance).to.be.greaterThan(0);
    });
    cy.get(tid("wallet.icbm-eth.upgrade-button")).click();
    cy.get(tid("modals.tx-sender.upgrade-flow.summery.upgradeSummary.accept")).click();
    confirmAccessModal();
    cy.get(tid("modals.shared.signing-message.modal"));
    cy.get(tid("modals.shared.tx-success.modal"));
    closeModal();
    cy.get(tid("locked-wallet.eth.balance-values.large-value")).should($e => {
      const val = parseFloat(extractNumber($e.text()));
      expect(val).to.be.greaterThan(0);
      expect(val).to.equal(icbmBalance);
    });
    cy.get(tid("wallet-start-container")).should($e => {
      expect($e.find(tid("icbm-wallet.eth.balance-values.large-value")).length).to.equal(0);
    });
  });
});
