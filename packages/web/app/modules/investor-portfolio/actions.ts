import { createActionFactory } from "@neufund/shared";

import { TEtoSpecsData } from "../../lib/api/eto/EtoApi.interfaces.unsafe";
import { Dictionary } from "../../types";
import { createAction } from "../actionsUtils";
import { TEtoWithCompanyAndContractReadonly } from "../eto/types";
import {
  ICalculatedContribution,
  IIncomingPayoutsData,
  IInvestorTicket,
  ITokenDisbursal,
  TTokensPersonalDiscount,
} from "./types";

export const investorEtoTicketActions = {
  // public actions
  loadEtoInvestorTicket: (eto: TEtoSpecsData) => createAction("INVESTOR_TICKET_LOAD", { eto }),
  loadInvestorTickets: (etos: Dictionary<TEtoSpecsData>) =>
    createAction("INVESTOR_TICKET_ETOS_LOAD", { etos }),
  loadTokenPersonalDiscount: createActionFactory(
    "INVESTOR_TICKET_LOAD_TOKEN_PERSONAL_DISCOUNT",
    (eto: TEtoWithCompanyAndContractReadonly) => ({ eto }),
  ),

  claim: (etoId: string) => createAction("INVESTOR_TICKET_CLAIM", { etoId }),
  loadClaimables: createActionFactory("INVESTOR_CLAIMABLES_LOAD"),
  getIncomingPayouts: createActionFactory("INVESTOR_TICKET_GET_INCOMING_PAYOUTS"),
  loadClaimablesInBackground: createActionFactory("INVESTOR_CLAIMABLES_LOAD_IN_BACKGROUND"),
  getIncomingPayoutsInBackground: createActionFactory(
    "INVESTOR_TICKET_GET_INCOMING_PAYOUTS_IN_BACKGROUND",
  ),

  // state mutations
  setEtoInvestorTicket: (etoId: string, ticket: IInvestorTicket) =>
    createAction("INVESTOR_TICKET_SET", { etoId, ticket }),
  setCalculatedContribution: (etoId: string, contribution: ICalculatedContribution) =>
    createAction("INVESTOR_TICKET_SET_CALCULATED_CONTRIBUTION", { etoId, contribution }),
  setInitialCalculatedContribution: (etoId: string, contribution: ICalculatedContribution) =>
    createAction("INVESTOR_TICKET_SET_INITIAL_CALCULATED_CONTRIBUTION", { etoId, contribution }),
  setTokensDisbursal: createActionFactory(
    "SET_TOKENS_DISBURSAL",
    (tokensDisbursal: ITokenDisbursal[]) => ({ tokensDisbursal }),
  ),
  setTokensDisbursalError: createActionFactory("SET_TOKENS_DISBURSAL_ERROR"),
  setIncomingPayouts: createActionFactory(
    "INVESTOR_TICKET_SET_INCOMING_PAYOUTS",
    (incomingPayouts: IIncomingPayoutsData) => ({
      incomingPayouts,
    }),
  ),
  setIncomingPayoutsError: createActionFactory("INVESTOR_TICKET_SET_INCOMING_PAYOUTS_ERROR"),
  resetIncomingPayouts: createActionFactory("INVESTOR_TICKET_RESET_INCOMING_PAYOUTS"),
  setTokenPersonalDiscount: createActionFactory(
    "INVESTOR_TICKET_SET_TOKEN_PERSONAL_DISCOUNTS",
    (etoId: string, tokenPersonalDiscount: TTokensPersonalDiscount) => ({
      etoId,
      tokenPersonalDiscount,
    }),
  ),
};
