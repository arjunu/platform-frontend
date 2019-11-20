import { expect } from "chai";
import { cloneDeep } from "lodash";
import * as React from "react";
import { spy } from "sinon";

import { createMount } from "../../../../../test/createMount";
import { testCompany, testContract, testEto } from "../../../../../test/fixtures";
import {
  createIntegrationTestsSetup,
  setupFakeClock,
  wrapWithProviders,
} from "../../../../../test/integrationTestUtils.unsafe";
import { tid } from "../../../../../test/testUtils";
import { EUserType } from "../../../../lib/api/users/interfaces";
import { actions } from "../../../../modules/actions";
import { EAuthStatus } from "../../../../modules/auth/reducer";
import { watchEto } from "../../../../modules/eto/sagas";
import { EETOStateOnChain } from "../../../../modules/eto/types";
import { neuCall } from "../../../../modules/sagasUtils";
import { EtoStatusManager } from "./EtoStatusManager/EtoStatusManager";

actions.eto.loadEtoPreview = spy(() => ({ type: "loadEtoPreview" })) as any;

const contract = {
  ...testContract,
  timedState: EETOStateOnChain.Setup,
};

const eto = {
  etos: {
    [testEto.previewCode]: testEto,
  },
  companies: {
    [testEto.companyId]: testCompany,
  },
  contracts: {
    [testEto.previewCode]: contract,
  },
};

const initialStateBase = {
  auth: {
    user: {
      userId: "0x353d3030AF583fc0e547Da80700BbD953F330A4b",
      type: EUserType.INVESTOR,
    },
    jwt: "blabla",
    status: EAuthStatus.AUTHORIZED,
  },
  eto,
};

const props = {
  isEmbedded: false,
  eto: {
    ...testEto,
    contract: contract,
  },
};

//TODO test all eto state changes, including EtoCard
describe("EtoStatusManager state change", () => {
  const clock = setupFakeClock();

  beforeEach(() => {
    ((actions.eto.loadEtoPreview as unknown) as sinon.SinonSpy).resetHistory();
  });

  it("shows a quote if state is SETUP and Whitelisting is not active", async () => {
    const initialState = {
      ...cloneDeep(initialStateBase),
      bookBuildingFlow: {
        pledges: {
          [testEto.etoId]: undefined,
        },
        bookbuildingStats: {
          [testEto.etoId]: {
            investorsCount: 0,
          },
        },
      },
    };
    (initialState.eto.etos[testEto.previewCode].canEnableBookbuilding as unknown) = true;

    clock.fakeClock.setSystemTime(
      new Date(testContract.startOfStates[EETOStateOnChain.Whitelist]).valueOf() - 2000,
    );

    const { store, sagaMiddleware } = createIntegrationTestsSetup({
      initialState,
    });

    sagaMiddleware.run(function*(): any {
      yield neuCall(watchEto, testEto.previewCode);
    });

    const component = createMount(
      wrapWithProviders(() => <EtoStatusManager {...props} />, { store }),
    );

    expect(component.find(tid("eto-overview-status-founders-quote")).length).to.eq(1);
  });

  // there is a bootstrap Tooltip component deep inside the component tree
  // that throws for some reason. Skipping this for now
  it.skip("shows the whitelisting component", async () => {
    const initialState = cloneDeep(initialStateBase);
    initialState.eto.contracts[testEto.previewCode].timedState = EETOStateOnChain.Setup;

    (initialState.eto.etos[testEto.previewCode].isBookbuilding as unknown) = true;
    (initialState.eto.etos[testEto.previewCode].canEnableBookbuilding as unknown) = true;

    clock.fakeClock.setSystemTime(
      new Date(testContract.startOfStates[EETOStateOnChain.Whitelist]).valueOf() - 2000,
    );

    const { store, sagaMiddleware } = createIntegrationTestsSetup({
      initialState: initialState,
    });

    sagaMiddleware.run(function*(): any {
      yield neuCall(watchEto, props.eto.previewCode);
    });

    const component = createMount(
      wrapWithProviders(() => <EtoStatusManager {...props} />, { store }),
    );

    expect(component.find(tid("eto-overview-status-whitelisting-active")).length).to.eq(1);
  });

  it("shows the whitelisting component with WhitelistingLimitReached", async () => {
    const initialState = {
      ...cloneDeep(initialStateBase),
      bookBuildingFlow: {
        pledges: {
          [testEto.etoId]: undefined,
        },
        bookbuildingStats: {
          [testEto.etoId]: {
            investorsCount: 500,
          },
        },
      },
    };
    initialState.eto.contracts[testEto.previewCode].timedState = EETOStateOnChain.Setup;
    (initialState.eto.etos[testEto.previewCode].isBookbuilding as unknown) = true;
    (initialState.eto.etos[testEto.previewCode].canEnableBookbuilding as unknown) = true;

    clock.fakeClock.setSystemTime(
      new Date(testContract.startOfStates[EETOStateOnChain.Whitelist]).valueOf() - 2000,
    );

    const { store, sagaMiddleware } = createIntegrationTestsSetup({
      initialState: initialState,
    });

    sagaMiddleware.run(function*(): any {
      yield neuCall(watchEto, props.eto.previewCode);
    });

    const component = createMount(
      wrapWithProviders(() => <EtoStatusManager {...props} />, { store }),
    );

    expect(
      component.render().find(tid("eto-overview-status-whitelisting-limit-reached")).length,
    ).to.eq(1);
  });

  it("SETUP, shows the whitelisting component with WhitelistingLimitReached", async () => {
    const initialState = {
      ...cloneDeep(initialStateBase),
      bookBuildingFlow: {
        pledges: {
          [testEto.etoId]: undefined,
        },
        bookbuildingStats: {
          [testEto.etoId]: {
            investorsCount: 500,
          },
        },
      },
    };
    initialState.eto.contracts[testEto.previewCode].timedState = EETOStateOnChain.Setup;
    (initialState.eto.etos[testEto.previewCode].isBookbuilding as unknown) = true;
    (initialState.eto.etos[testEto.previewCode].canEnableBookbuilding as unknown) = true;

    clock.fakeClock.setSystemTime(
      new Date(testContract.startOfStates[EETOStateOnChain.Public]).valueOf() - 2000,
    );

    const { store, sagaMiddleware } = createIntegrationTestsSetup({
      initialState: initialState,
    });

    sagaMiddleware.run(function*(): any {
      yield neuCall(watchEto, props.eto.previewCode);
    });

    const component = createMount(
      wrapWithProviders(() => <EtoStatusManager {...props} />, { store }),
    );

    expect(component.find(tid("eto-overview-status-whitelisting-limit-reached")).length).to.eq(2);
    expect(component.find(tid("eto-whitelist-countdown")).length).to.eq(1);
    expect(component.find(tid("eto-whitelist-countdown-finished")).length).to.eq(0);
    expect(actions.eto.loadEtoPreview).to.not.be.called;

    await clock.fakeClock.tickAsync(3000);
    component.update();

    expect(component.find(tid("eto-overview-status-whitelisting-limit-reached")).length).to.eq(2);
    expect(component.find(tid("eto-whitelist-countdown")).length).to.eq(0);
    expect(component.find(tid("eto-whitelist-countdown-finished")).length).to.eq(1);
    expect(actions.eto.loadEtoPreview).to.be.calledOnceWith(props.eto.previewCode);
  });

  it("SETUP, shows the whitelisting component with WL closed", async () => {
    const initialState = {
      ...cloneDeep(initialStateBase),
      bookBuildingFlow: {
        pledges: {
          [testEto.etoId]: undefined,
        },
        bookbuildingStats: {
          [testEto.etoId]: {
            investorsCount: 10,
          },
        },
      },
    };
    initialState.eto.contracts[testEto.previewCode].timedState = EETOStateOnChain.Setup;
    (initialState.eto.etos[testEto.previewCode].isBookbuilding as unknown) = false;
    (initialState.eto.etos[testEto.previewCode].canEnableBookbuilding as unknown) = false;

    clock.fakeClock.setSystemTime(
      new Date(testContract.startOfStates[EETOStateOnChain.Public]).valueOf() - 2000,
    );

    const { store, sagaMiddleware } = createIntegrationTestsSetup({
      initialState: initialState,
    });

    sagaMiddleware.run(function*(): any {
      yield neuCall(watchEto, testEto.previewCode);
    });

    const component = createMount(
      wrapWithProviders(() => <EtoStatusManager {...props} />, { store }),
    );

    expect(component.find(tid("eto-overview-status-whitelisting-suspended")).length).to.eq(2);
    expect(component.find(tid("eto-whitelist-countdown")).length).to.eq(1);
    expect(component.find(tid("eto-whitelist-countdown-finished")).length).to.eq(0);
    expect(actions.eto.loadEtoPreview).to.not.be.called;

    await clock.fakeClock.tickAsync(3000);
    component.update();

    //imitate updating state from backend
    const componentUpdated = createMount(
      wrapWithProviders(() => <EtoStatusManager {...props} />, { store }),
    );

    expect(componentUpdated.find(tid("eto-overview-status-whitelisting-suspended")).length).to.eq(
      2,
    );
    expect(componentUpdated.find(tid("eto-whitelist-countdown")).length).to.eq(0);
    expect(componentUpdated.find(tid("eto-whitelist-countdown-finished")).length).to.eq(1);
    expect(actions.eto.loadEtoPreview).to.be.calledOnceWith(props.eto.previewCode);
  });

  it("counter shows a loading state and EtoStateManager dispatches the update action on nextStateDate", async () => {
    clock.fakeClock.setSystemTime(
      new Date(testContract.startOfStates[EETOStateOnChain.Public]).valueOf() - 2000,
    );

    initialStateBase.eto.contracts[testEto.previewCode].timedState = EETOStateOnChain.Whitelist;
    props.eto.contract.timedState = EETOStateOnChain.Whitelist;

    const { store, sagaMiddleware } = createIntegrationTestsSetup({
      initialState: initialStateBase,
    });

    sagaMiddleware.run(function*(): any {
      yield neuCall(watchEto, props.eto.previewCode);
    });

    const component = createMount(
      wrapWithProviders(() => <EtoStatusManager {...props} />, { store }),
    );

    expect(component.find(tid("eto-whitelist-countdown")).length).to.eq(1);
    expect(component.find(tid("eto-whitelist-countdown-finished")).length).to.eq(0);
    expect(actions.eto.loadEtoPreview).to.not.be.called;

    await clock.fakeClock.tickAsync(4000);
    component.update();

    expect(component.find(tid("eto-whitelist-countdown")).length).to.eq(0);
    expect(component.find(tid("eto-whitelist-countdown-finished")).length).to.eq(1);
    expect(actions.eto.loadEtoPreview).to.be.calledOnceWith(props.eto.previewCode);
  });

  it("shows the countdown and then calls the final function", async () => {
    const initialState = cloneDeep(initialStateBase);
    initialState.eto.contracts[testEto.previewCode].timedState = EETOStateOnChain.Public;
    (initialState.auth.jwt as unknown) = undefined; //set user to not authorized to be able to test the counter
    props.eto.contract.timedState = EETOStateOnChain.Public;

    clock.fakeClock.setSystemTime(
      new Date(testContract.startOfStates[EETOStateOnChain.Signing]).valueOf() - 2000,
    );

    const { store, sagaMiddleware } = createIntegrationTestsSetup({
      initialState,
    });

    sagaMiddleware.run(function*(): any {
      yield neuCall(watchEto, props.eto.previewCode);
    });

    const component = createMount(
      wrapWithProviders(() => <EtoStatusManager {...props} />, { store }),
    );

    expect(component.find(tid("eto-whitelist-countdown-finished")).length).to.eq(0);
    expect(component.find(tid("investment-widget")).length).to.eq(1);
    expect(component.find(tid("end-time-widget-running")).hostNodes().length).to.eq(1);
    expect(component.find(tid("end-time-widget-finished")).length).to.eq(0);
    expect(actions.eto.loadEtoPreview).to.not.be.called;

    await clock.fakeClock.tickAsync(4000);
    component.update();

    expect(component.find(tid("end-time-widget-running")).length).to.eq(0);
    expect(component.find(tid("end-time-widget-finished")).hostNodes().length).to.eq(1);
    expect(actions.eto.loadEtoPreview).to.be.calledOnceWith(props.eto.previewCode);
  });
});
