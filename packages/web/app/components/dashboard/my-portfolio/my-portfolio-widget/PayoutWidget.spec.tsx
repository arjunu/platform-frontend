import { BigNumber } from "bignumber.js";
import { expect } from "chai";
import { createMemoryHistory } from "history";
import { createStore } from "redux";

import { createMount } from "../../../../../test/createMount";
import {
  createIntegrationTestsSetup,
  setupFakeClock,
  waitForTid,
  wrapWithProviders,
} from "../../../../../test/integrationTestUtils.unsafe";
import { createMock, tid } from "../../../../../test/testUtils";
import { EtherToken } from "../../../../lib/contracts/EtherToken";
import { EuroToken } from "../../../../lib/contracts/EuroToken";
import { FeeDisbursal } from "../../../../lib/contracts/FeeDisbursal";
import { Neumark } from "../../../../lib/contracts/Neumark";
import { ContractsService } from "../../../../lib/web3/ContractsService";
import { generateRootReducer } from "../../../../store";
import { PayoutWidget } from "./PayoutWidget";

/*
 * when getting the payout data from node this component checks if contract's snapshot date
 * is the same as today's (computer clock) date to determine if the users's clock isn't too fast and we're not starting
 * a countdown in case that user entered the next day but the data from node is from the previous one.
 *
 * Snapshot date is calculated in utils/calculateSnapshotDate() as
 * contracts.neumark.currentSnapshotId / (2**128) * dayInSeconds.
 *
 * We mock contracts.neumark.currentSnapshotId (contractsMock) and user's clock
 * (ACTUAL_DATE vs NOT_ACTUAL_DATE) to simulate various conditions regarding snapshot date.
 *
 * note that node uses posix timestamp (seconds) and JS' Date() uses milliseconds
 * so that every timestamp must be *1000.
 * */

const ACTUAL_DATE = 1567468800 * 1000;
const NOT_ACTUAL_DATE = 1567555199 * 1000;

const history = createMemoryHistory();

const initialState = {
  auth: {
    user: {
      userId: "0x353d3030AF583fc0e547Da80700BbD953F330A4b",
    },
  },
  investorTickets: {
    incomingPayouts: {
      loading: true,
      data: undefined,
    },
    tokensDisbursal: {
      loading: true,
      error: false,
      data: undefined,
    },
  },
};

const getNonClaimableDisbursalsRejection = (_: string, _1: string) =>
  Promise.reject("nothing for you here");

const getNonClaimableDisbursalsEmpty = (_: string, _1: string) => Promise.resolve([]);

const getNonClaimableDisbursalsData = (_: string, _1: string) =>
  Promise.resolve([
    [
      new BigNumber("6.173402700679665604152542128027138892234753e+42"),
      new BigNumber("1.1000012812e+23"),
      new BigNumber("3"),
    ],
    [
      new BigNumber("6.173402700679665604152542128027138892234753e+42"),
      new BigNumber("128128120000000000000"),
      new BigNumber("3"),
    ],
  ]);

const claimableMutipleByTokenEmpty = (_: string[], _1: string, _2: string) =>
  Promise.resolve([
    [
      new BigNumber("0"),
      new BigNumber("2.912595230000000001e+23"),
      new BigNumber("1693621077"),
      new BigNumber("0"),
    ],
    [
      new BigNumber("0"),
      new BigNumber("165807026200000000000"),
      new BigNumber("1693621077"),
      new BigNumber("0"),
    ],
  ]);

const claimableMutipleByTokenData = (_: string[], _1: string, _2: string) =>
  Promise.resolve([
    [
      new BigNumber("385870835772284106359"),
      new BigNumber("2.912595230000000001e+23"),
      new BigNumber("1693621077"),
      new BigNumber("0"),
    ],
    [
      new BigNumber("219666966139716598"),
      new BigNumber("165807026200000000000"),
      new BigNumber("1693621077"),
      new BigNumber("0"),
    ],
  ]);

const feeDisbursalMock = createMock(FeeDisbursal, {
  getNonClaimableDisbursals: getNonClaimableDisbursalsData,
  claimableMutipleByToken: claimableMutipleByTokenData,
});

const contractsMock = createMock(ContractsService, {
  neumark: createMock(Neumark, {
    balanceOf: (_address: string) => Promise.resolve(new BigNumber("1")),
    currentSnapshotId: Promise.resolve(
      new BigNumber("6.173402700679665604152542128027138892234753e+42"),
    ),
  }),
  etherToken: createMock(EtherToken, {
    address: "0x00Be000B00f000000dC0fEe000FDCBD00C000D00",
  }),
  euroToken: createMock(EuroToken, {
    address: "0x00Be000B00f000000dC0fEe000FDCBD00C000D00",
  }),
  feeDisbursal: feeDisbursalMock,
});

const rootReducer = generateRootReducer(history);

describe("PayoutWidget", () => {
  const clock = setupFakeClock();

  it("shows the loading indicator", () => {
    const store = createStore(rootReducer, initialState);
    const component = createMount(wrapWithProviders(PayoutWidget, { store }));

    expect(component.find(tid("loading-indicator-pulse")).length).to.eq(1);
  });

  it("shows the error", async () => {
    feeDisbursalMock.reMock({
      getNonClaimableDisbursals: getNonClaimableDisbursalsRejection,
    });

    const { store, container } = createIntegrationTestsSetup({
      contractsMock,
      initialState,
    });
    const component = createMount(wrapWithProviders(PayoutWidget, { store, container }));

    await clock.fakeClock.tickAsync(2000);
    component.update();
    expect(component.render().find(tid("my-portfolio-widget-error")).length).to.eq(1);
  });

  it("shows the welcome component", async () => {
    clock.fakeClock.setSystemTime(ACTUAL_DATE);

    feeDisbursalMock.reMock({
      getNonClaimableDisbursals: getNonClaimableDisbursalsEmpty,
      claimableMutipleByToken: claimableMutipleByTokenEmpty,
    });

    const { store, container } = createIntegrationTestsSetup({
      contractsMock,
      initialState,
    });
    const component = createMount(wrapWithProviders(PayoutWidget, { store, container }));

    await clock.fakeClock.tickAsync(2000);
    component.update();

    expect(component.find(tid("my-portfolio-widget-welcome")).length).to.eq(1);
  });

  it("shows the available payouts component", async () => {
    clock.fakeClock.setSystemTime(ACTUAL_DATE);

    feeDisbursalMock.reMock({
      getNonClaimableDisbursals: getNonClaimableDisbursalsEmpty,
      claimableMutipleByToken: claimableMutipleByTokenData,
    });

    const { store, container } = createIntegrationTestsSetup({
      contractsMock,
      initialState,
    });
    const component = createMount(wrapWithProviders(PayoutWidget, { store, container }));
    await clock.fakeClock.tickAsync(2000);
    component.update();

    expect(component.find(tid("my-portfolio-widget-incoming-payout-available")).length).to.eq(1);
  });

  it("shows the pending payouts component in waiting state if there are pending payouts but snapshot's date is different from system date", async () => {
    clock.fakeClock.setSystemTime(1559561573 * 1000);

    feeDisbursalMock.reMock({
      getNonClaimableDisbursals: getNonClaimableDisbursalsData,
      claimableMutipleByToken: claimableMutipleByTokenData,
    });

    const { store, container } = createIntegrationTestsSetup({
      contractsMock,
      initialState,
    });
    const component = createMount(wrapWithProviders(PayoutWidget, { store, container }));
    clock.fakeClock.tick(4000);

    await waitForTid(component, "my-portfolio-widget-incoming-payout-waiting");

    expect(component.find(tid("my-portfolio-widget-incoming-payout-waiting")).length).to.eq(1);
  });

  it("shows the pending payouts component if there are pending payouts and snapshot's date is the same as system date", async () => {
    clock.fakeClock.setSystemTime(ACTUAL_DATE);

    const { store, container } = createIntegrationTestsSetup({
      contractsMock,
      initialState,
    });
    const component = createMount(wrapWithProviders(PayoutWidget, { store, container }));
    component.update();
    await waitForTid(component, "my-portfolio-widget-incoming-payout-pending");
    expect(component.find(tid("my-portfolio-widget-incoming-payout-pending")).length).to.eq(1);
  });

  it("switches from pending payouts component to waiting state if the contract snapshot is not from today", async () => {
    clock.fakeClock.setSystemTime(NOT_ACTUAL_DATE);

    const { store, container } = createIntegrationTestsSetup({
      contractsMock,
      initialState,
    });
    const component = createMount(wrapWithProviders(PayoutWidget, { store, container }));
    component.update();

    await waitForTid(component, "my-portfolio-widget-incoming-payout-pending");
    expect(component.find(tid("my-portfolio-widget-incoming-payout-pending")).length).to.eq(1);

    await clock.fakeClock.tickAsync(2000);
    component.update();

    await waitForTid(component, "my-portfolio-widget-incoming-payout-waiting");
    expect(component.find(tid("my-portfolio-widget-incoming-payout-waiting")).length).to.eq(1);
  });

  it("switches from pending payouts component to available payouts state", async () => {
    clock.fakeClock.setSystemTime(NOT_ACTUAL_DATE);

    const { store, container } = createIntegrationTestsSetup({
      contractsMock,
      initialState,
    });
    const component = createMount(wrapWithProviders(PayoutWidget, { store, container }));

    await waitForTid(component, "my-portfolio-widget-incoming-payout-pending");
    expect(component.find(tid("my-portfolio-widget-incoming-payout-pending")).length).to.eq(1);

    feeDisbursalMock.reMock({
      getNonClaimableDisbursals: getNonClaimableDisbursalsEmpty,
    });

    await clock.fakeClock.tickAsync(2000);

    await waitForTid(component, "my-portfolio-widget-incoming-payout-available");
    expect(component.find(tid("my-portfolio-widget-incoming-payout-available")).length).to.eq(1);
  });

  it("switches from pending payouts component to to waiting state and then to available payouts state", async () => {
    clock.fakeClock.setSystemTime(NOT_ACTUAL_DATE);
    feeDisbursalMock.reMock({
      getNonClaimableDisbursals: getNonClaimableDisbursalsData,
    });

    const { store, container } = createIntegrationTestsSetup({
      contractsMock,
      initialState,
    });
    const component = createMount(wrapWithProviders(PayoutWidget, { store, container }));

    await waitForTid(component, "my-portfolio-widget-incoming-payout-pending");
    expect(component.find(tid("my-portfolio-widget-incoming-payout-pending")).length).to.eq(1);

    // pending state counter switches to the new day
    // but the timestamp returned from node is from previous day (user's clock is too fast)
    // in this case we enter the waiting state
    await clock.fakeClock.tickAsync(2000);

    await waitForTid(component, "my-portfolio-widget-incoming-payout-waiting");
    expect(component.find(tid("my-portfolio-widget-incoming-payout-waiting")).length).to.eq(1);

    // in waiting state we poll the node every second.
    // at some point the node stops to return non-yet-claimables
    // so there are only available payouts returned and we enter the available state
    feeDisbursalMock.reMock({
      getNonClaimableDisbursals: getNonClaimableDisbursalsEmpty,
    });

    await clock.fakeClock.tickAsync(2000);

    await waitForTid(component, "my-portfolio-widget-incoming-payout-available");
    expect(component.find(tid("my-portfolio-widget-incoming-payout-available")).length).to.eq(1);
  });
});
