import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TETOWithInvestorTicket } from "../../../../modules/investor-portfolio/types";
import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { UserClaimSummaryComponent } from "./Summary";

storiesOf("User Claim Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <UserClaimSummaryComponent
      additionalData={{
        etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
        costUlps: "1200000000000000000",
        neuRewardUlps: "5500000000000000000",
        tokenName: "Fifth Force",
        tokenQuantity: 100,
      }}
      onAccept={() => {}}
      generateTemplateByEtoId={() => {}}
      pendingDownloads={{}}
      etoData={
        {
          etoId: "0xfaDa8f267C054f469b52Ccbeb08250ACAAeE65dc",
          investorTicket: {
            equityTokenInt: "100",
            amountEth: "1",
            amountEurUlps: "40",
            equivEurUlps: "1",
            rewardNmkUlps: "1",
            sharesInt: "1",
            tokenPrice: "1",
            neuRate: "1",
            claimedOrRefunded: true,
            usedLockedAccount: true,
          },
        } as TETOWithInvestorTicket
      }
      downloadDocument={() => {}}
    />
  ));
