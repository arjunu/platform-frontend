import { expect } from "chai";
import { render } from "enzyme";
import { cloneDeep } from "lodash";
import * as React from "react";

import { testEto } from "../../../../../../test/fixtures";
import { wrapWithIntl } from "../../../../../../test/integrationTestUtils.unsafe";
import { tid } from "../../../../../../test/testUtils";
import { TEtoWithCompanyAndContractReadonly } from "../../../../../modules/eto/types";
import { DeepWritable } from "../../../../../types";
import { InvestmentLayout } from "./InvestmentStatus";

describe("InvestmentStatus", () => {
  let initialEnv: any;
  let testData: DeepWritable<TEtoWithCompanyAndContractReadonly>;

  beforeEach(() => {
    initialEnv = process.env.NF_MAY_SHOW_INVESTOR_STATS;
    process.env.NF_MAY_SHOW_INVESTOR_STATS = "1";

    // tslint:disable-next-line:no-useless-cast
    testData = cloneDeep(testEto) as DeepWritable<TEtoWithCompanyAndContractReadonly>;
  });

  afterEach(() => {
    process.env.NF_MAY_SHOW_INVESTOR_STATS = initialEnv;
  });

  it("should show 2 investors", () => {
    testData.contract!.totalInvestment.totalInvestors = "2";
    const component = render(
      wrapWithIntl(<InvestmentLayout eto={testData} nextStateDate={undefined} />),
    );

    expect(
      component
        .find(tid(`eto-overview-${testEto.etoId}-investors-count`))
        .find(tid("value"))
        .text(),
    ).to.eq("2");
  });

  it("should show 100000000000000000 investors", () => {
    testData.contract!.totalInvestment.totalInvestors = "100000000000000000";

    const component = render(
      wrapWithIntl(<InvestmentLayout eto={testData} nextStateDate={undefined} />),
    );

    expect(
      component
        .find(tid(`eto-overview-${testEto.etoId}-investors-count`))
        .find(tid("value"))
        .text(),
    ).to.eq("100 000 000 000 000 000");
  });

  it("should throw if number of investors is not parsable as number", () => {
    testData.contract!.totalInvestment.totalInvestors = "bla";

    expect(() =>
      render(wrapWithIntl(<InvestmentLayout eto={testData} nextStateDate={undefined} />)),
    ).to.throw();
  });
});
