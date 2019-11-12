import { expect } from "chai";
import { spy } from "sinon";

import { testCompany, testContract, testEto } from "../../../test/fixtures";
import {
  createIntegrationTestsSetup,
  setupFakeClock,
} from "../../../test/integrationTestUtils.unsafe";
import { actions } from "../actions";
import { neuCall } from "../sagasUtils";
import { watchEto } from "./sagas";
import { EETOStateOnChain } from "./types";

actions.eto.loadEtoPreview = spy(() => ({ type: "loadEtoPreview" })) as any;

const eto = {
  etos: {
    [testEto.previewCode]: testEto,
  },
  companies: {
    [testEto.companyId]: testCompany,
  },
  contracts: {
    [testEto.previewCode]: {
      ...testContract,
      timedState: EETOStateOnChain.Whitelist,
    },
  },
};

const initialState = {
  auth: {
    user: {
      userId: "0x353d3030AF583fc0e547Da80700BbD953F330A4b",
    },
  },
  eto,
};

const props = {
  isEmbedded: false,
  eto: {
    ...testEto,
    company: testCompany,
    contract: {
      ...testContract,
      timedState: EETOStateOnChain.Whitelist,
    },
  },
};

describe("ETO state change polling", () => {
  const clock = setupFakeClock();

  beforeEach(() => {
    ((actions.eto.loadEtoPreview as unknown) as sinon.SinonSpy).resetHistory();
  });

  it("saga polls on eto", async () => {
    clock.fakeClock.setSystemTime(
      //start the test with nextStateDate - 2 minutes to check if/how often saga polls
      new Date(testContract.startOfStates[EETOStateOnChain.Public]).valueOf() - 1000 * 60 * 2,
    );

    const { sagaMiddleware } = createIntegrationTestsSetup({
      initialState,
    });

    sagaMiddleware.run(function*(): any {
      yield neuCall(watchEto, props.eto.previewCode);
    });

    expect(actions.eto.loadEtoPreview).to.not.be.called;

    await clock.fakeClock.tickAsync(1000 * 60);

    expect(actions.eto.loadEtoPreview).to.be.calledOnceWith(props.eto.previewCode);

    await clock.fakeClock.tickAsync(1000 * 60);

    expect(actions.eto.loadEtoPreview).to.be.called.callCount(2);

    ((actions.eto.loadEtoPreview as unknown) as sinon.SinonSpy).resetHistory();
    //next state Time. From now on it polls every 2 seconds
    // for 1 minute and then every 5 seconds
    await clock.fakeClock.tickAsync(2000);

    await clock.fakeClock.tickAsync(1000 * 60);

    expect(actions.eto.loadEtoPreview).to.be.called.callCount(30);

    ((actions.eto.loadEtoPreview as unknown) as sinon.SinonSpy).resetHistory();

    await clock.fakeClock.tickAsync(1000 * 60 * 4);

    expect(actions.eto.loadEtoPreview).to.be.called.callCount(48);
  });
});
