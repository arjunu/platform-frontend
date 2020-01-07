import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testCompany, testContract, testEto } from "../../../../../test/fixtures";
import {
  EEtoViewCampaignOverviewType,
  TCampaignOverviewData,
} from "../../../../modules/eto-view/shared/types";
import { withStore } from "../../../../utils/storeDecorator.unsafe";
import { EtoViewInvestor } from "../EtoViewInvestorLayout";
import { EtoViewIssuer } from "../EtoViewIssuerLayout";

const testStore = {
  eto: {
    etos: {
      "deabb8a4-d081-4d15-87a7-737a09e6a87c": testEto,
    },
    contracts: {
      "deabb8a4-d081-4d15-87a7-737a09e6a87c": testContract,
    },
    companies: {
      "0xC8f867Cf4Ed30b4fF0Aa4c4c8c6b684397B219B0": testCompany,
    },
  },
};

const campaignOverviewData: TCampaignOverviewData = {
  campaignOverviewType: EEtoViewCampaignOverviewType.WITH_STATS,
  url: "https://test_url",
  path: "test_url",
  showYouTube: true,
  showSlideshare: true,
  showSocialChannels: true,
  showInvestmentTerms: true,
  showTwitterFeed: true,
  twitterUrl: "twitter_url",
};

storiesOf("ETO/EtoView", module)
  .addDecorator(withStore(testStore))
  .add("investor view", () => (
      <EtoViewInvestor
        eto={testEto}
        userIsFullyVerified={true}
        campaignOverviewData={campaignOverviewData}
      />
  ))
  .add("issuer view", () => (
      <EtoViewIssuer
        eto={testEto}
        campaignOverviewData={campaignOverviewData}
        userIsFullyVerified={true}
      />
  ));
